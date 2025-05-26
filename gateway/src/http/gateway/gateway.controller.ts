import {
    Body,
    Controller,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Post,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { HTTPTrace } from '~src/app/decorators/http-trace.decorator';
import { HttpExceptionFilter } from '~src/app/filter/error.filter';
import { TracingInterceptor } from '~src/app/interceptors/tracing.interceptor';
import { ApplicationService } from '~src/data-modules/application/application.service';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';
import { ReqCreateParentProfileDto } from '~src/data-modules/gateway/dto/request-dto/req-create-parent-profile.dto';
import { ReqCreateSitterProfileDto } from '~src/data-modules/gateway/dto/request-dto/req-create-sitter-profile.dto';
import { ReqGetUserInfoDto } from '~src/data-modules/gateway/dto/request-dto/req-get-user-info.dto';
import { ResCreateParentProfileDto } from '~src/data-modules/gateway/dto/response-dto/res-create-parent-profile.dto';
import { ResCreateSitterProfileDto } from '~src/data-modules/gateway/dto/response-dto/res-create-sitter-profile.dto';
import { ResGetActualOrdersDto } from '~src/data-modules/gateway/dto/response-dto/res-get-actual-orders.dto';
import { ResGetUserInfoDto } from '~src/data-modules/gateway/dto/response-dto/res-get-user-info.dto';
import { OrderService } from '~src/data-modules/order/order.service';
import { ParentProfileService } from '~src/data-modules/parent-profile/parent-profile.service';
import { RatingService } from '~src/data-modules/rating/rating.service';
import { ReviewService } from '~src/data-modules/review/review.service';
import { SitterProfileService } from '~src/data-modules/sitter-profile/sitter-profile.service';
import { UserService } from '~src/data-modules/user/user.service';

class GrpcDto<T> {
    data: T;
    _error: any;
}

@Controller('gateway')
export class GatewayController {
    constructor(
        private readonly userService: UserService,
        private readonly parentProfileService: ParentProfileService,
        private readonly sitterProfileService: SitterProfileService,
        private readonly orderService: OrderService,
        private readonly applicationService: ApplicationService,
        private readonly ratingService: RatingService,
        private readonly reviewService: ReviewService,
    ) {}

    @Post('/userInfo')
    @ApiOperation({
        summary: 'Получить всю информацию о пользователе и его профиле',
        operationId: 'get-user-info',
    })
    @ApiBody({
        schema: {
            properties: {
                profileType: {
                    type: 'string',
                    enum: Object.values(ProfileType),
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Информация о пользователе получена',
        type: ResGetUserInfoDto,
    })
    @ApiResponse({ status: 401, description: 'Неверный токен авторизации' })
    @ApiBearerAuth('defaultBearerAuth')
    @HTTPTrace('GatewayController.getUserInfo')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async getUserInfo(
        @Headers() headers,
        @Body() dto: ReqGetUserInfoDto,
    ): Promise<ResGetUserInfoDto> {
        const user = await this.userService.checkJwt(headers);
        if (user._error) {
            throw new HttpException(user._error.message, user._error.code);
        }
        if (!user.data) {
            throw new HttpException(`error with JWT`, HttpStatus.UNAUTHORIZED);
        }

        let profileId: number | undefined;
        if (dto.profileType == ProfileType.PARENT) {
            profileId = user.data.parentProfileId;
        } else if (dto.profileType == ProfileType.SITTER) {
            profileId = user.data.sitterProfileId;
        }
        if (!profileId) {
            throw new HttpException(
                `user with id = ${user.data.id} does not have profile with type = ${dto.profileType}`,
                HttpStatus.NOT_FOUND,
            );
        }

        let profile;
        if (dto.profileType == ProfileType.PARENT) {
            profile = await this.parentProfileService.get(profileId);
        } else if (dto.profileType == ProfileType.SITTER) {
            profile = await this.sitterProfileService.get(profileId);
        }
        if (profile._error) {
            throw new HttpException(
                profile._error.message,
                profile._error.code,
            );
        }
        if (!profile.data) {
            throw new HttpException(
                `profile with id = ${profileId} and profile type = ${dto.profileType} does not exist`,
                HttpStatus.NOT_FOUND,
            );
        }

        const [rating, reviews] = await Promise.all([
            this.ratingService.get({
                profileId: user.data.id,
                profileType: dto.profileType,
            }),
            this.reviewService.getListForProfile({
                profileToId: user.data.id,
                profileToType: dto.profileType,
            }),
        ]);

        const resGetUser: ResGetUserInfoDto = {
            user: user.data,
            profile: profile.data,
            rating: rating.data,
            reviews: reviews.data,
        };

        return resGetUser;
    }

    @Get('/getActualOrders')
    @ApiOperation({
        summary: 'Получить все актуальные заказы',
        operationId: 'get-actual-orders',
    })
    @ApiResponse({
        status: 200,
        description: 'Актуальные заказы получены',
        type: ResGetActualOrdersDto,
    })
    @ApiResponse({ status: 401, description: 'Неверный токен авторизации' })
    @ApiBearerAuth('defaultBearerAuth')
    @HTTPTrace('GatewayController.getUserInfo')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async getActualOrders(
        @Headers() headers,
    ): Promise<GrpcDto<ResGetActualOrdersDto[]>> {
        const user = await this.userService.checkJwt(headers);
        if (user._error) {
            throw new HttpException(user._error.message, user._error.code);
        }
        if (!user.data) {
            throw new HttpException(`error with JWT`, HttpStatus.UNAUTHORIZED);
        }

        const actualOrders = await this.orderService.getActualOrders();

        if (actualOrders._error) {
            throw new HttpException(
                actualOrders._error.message,
                actualOrders._error.code,
            );
        }

        if (actualOrders.data) {
            let resActualOrders: GrpcDto<ResGetActualOrdersDto[]> = {
                data: [],
                _error: null,
            };
            for (let order of actualOrders.data) {
                const parentUser = await this.userService.getByProfile({
                    profileId: order.parentId,
                    profileType: ProfileType.PARENT,
                });
                if (parentUser._error) {
                    throw new HttpException(
                        parentUser._error.message,
                        parentUser._error.code,
                    );
                }
                if (!parentUser.data) {
                    throw new HttpException(
                        `parent profile with id = ${order.parentId} does not exist`,
                        HttpStatus.NOT_FOUND,
                    );
                }

                const parentName = `${parentUser.data.secondName} ${parentUser.data.firstName}`;

                resActualOrders.data.push({ ...order, parentName: parentName });
            }
            return resActualOrders;
        }

        const resActualOrders: GrpcDto<ResGetActualOrdersDto[]> = {
            data: [],
            _error: null,
        };
        return resActualOrders;
    }

    @Post('/createParent')
    @ApiOperation({
        summary: 'Создать профиль родителя',
        operationId: 'create-parent-profile',
    })
    @ApiBody({
        schema: {
            properties: {
                ordersAmount: { type: 'number' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Профиль родителя создан',
        type: ReqCreateParentProfileDto,
    })
    @ApiResponse({ status: 401, description: 'Неверный токен авторизации' })
    @ApiBearerAuth('defaultBearerAuth')
    @HTTPTrace('GatewayController.getUserInfo')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async createParent(
        @Headers() headers,
        dto: ReqCreateParentProfileDto,
    ): Promise<GrpcDto<ResCreateParentProfileDto | null>> {
        const user = await this.userService.checkJwt(headers);
        if (user._error) {
            throw new HttpException(user._error.message, user._error.code);
        }
        if (!user.data) {
            throw new HttpException(`error with JWT`, HttpStatus.UNAUTHORIZED);
        }

        const parent = await this.parentProfileService.put(dto);

        if (parent._error) {
            throw new HttpException(parent._error.message, parent._error.code);
        }
        if (!parent.data) {
            throw new HttpException(
                `error creating parent profile`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        await this.userService.updateUser({
            id: user.data.id,
            parentProfileId: parent.data.id,
        });

        await this.ratingService.put({
            profileId: parent.data.id,
            profileType: ProfileType.PARENT,
            rating: 0,
            reviewsAmount: 0,
        });

        return parent;
    }

    @Post('/createSitter')
    @ApiOperation({
        summary: 'Создать профиль ситтера',
        operationId: 'create-parent-sitter',
    })
    @ApiBody({
        schema: {
            properties: {
                ordersAmount: { type: 'number' },
                price: { type: 'number' },
                location: { type: 'string' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Профиль ситтера создан',
        type: ResCreateSitterProfileDto,
    })
    @ApiResponse({ status: 401, description: 'Неверный токен авторизации' })
    @ApiBearerAuth('defaultBearerAuth')
    @HTTPTrace('GatewayController.getUserInfo')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async createSitter(
        @Headers() headers,
        dto: ReqCreateSitterProfileDto,
    ): Promise<GrpcDto<ResCreateSitterProfileDto | null>> {
        const user = await this.userService.checkJwt(headers);
        if (user._error) {
            throw new HttpException(user._error.message, user._error.code);
        }
        if (!user.data) {
            throw new HttpException(`error with JWT`, HttpStatus.UNAUTHORIZED);
        }

        const sitter = await this.sitterProfileService.put(dto);

        if (sitter._error) {
            throw new HttpException(sitter._error.message, sitter._error.code);
        }
        if (!sitter.data) {
            throw new HttpException(
                `error creating sitter profile`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        await this.userService.updateUser({
            id: user.data.id,
            sitterProfileId: sitter.data.id,
        });

        await this.ratingService.put({
            profileId: sitter.data.id,
            profileType: ProfileType.SITTER,
            rating: 0,
            reviewsAmount: 0,
        });

        return sitter;
    }
}
