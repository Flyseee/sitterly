import {
    Body,
    Controller,
    Get,
    OnModuleInit,
    Put,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { join } from 'path';
import { HTTPTrace } from '~src/app/decorators/http-trace.decorator';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';
import { ReqCreateReviewDto } from '~src/data-modules/review/request-dto/req-create-review.dto';
import { ReqGetReviewsForProfileDto } from '~src/data-modules/review/request-dto/req-get-reviews-for-profile.dto';
import { ResCreateReviewDto } from '~src/data-modules/review/response-dto/res-create-review.dto';
import { ResGetReviewsForProfileDto } from '~src/data-modules/review/response-dto/res-get-reviews-for-profile.dto';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface ProfileReviewsRpcService {
    put(dto: ReqCreateReviewDto): Promise<GrpcDto<ResCreateReviewDto>>;

    getListForProfile(
        dto: ReqGetReviewsForProfileDto,
    ): Promise<GrpcDto<ResGetReviewsForProfileDto[]>>;
}

@Controller('profileReviews')
export class ProfileReviewsController implements OnModuleInit {
    private profileReviewsRpcService: ProfileReviewsRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'reviews',
            protoPath: join(__dirname, '../../grpc/proto/review.proto'),
            url: '89.169.2.227:54055',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.profileReviewsRpcService =
            this.client.getService<ProfileReviewsRpcService>(
                'ProfileReviewsRpcService',
            );
    }

    @Put('/reviews')
    @ApiOperation({
        summary: 'Создать отзыв',
        operationId: 'create-review',
    })
    @ApiResponse({
        status: 200,
        description: 'Отзыв создан',
        type: GrpcDto<ResCreateReviewDto>,
    })
    @ApiBody({
        schema: {
            properties: {
                profileFromId: { type: 'number' },
                profileToId: { type: 'number' },
                profileToType: {
                    type: 'string',
                    enum: Object.values(ProfileType),
                },
                text: { type: 'string' },
                stars: { type: 'number' },
            },
        },
    })
    @HTTPTrace('ProfileReviewsRpcService.put')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async put(
        @Body() dto: ReqCreateReviewDto,
    ): Promise<GrpcDto<ResCreateReviewDto>> {
        return this.profileReviewsRpcService.put(dto);
    }

    @Get('/reviews')
    @ApiOperation({
        summary: 'Получить отзывы профиля',
        operationId: 'get-profile-reviews',
    })
    @ApiResponse({
        status: 200,
        description: 'Отзывы получены',
        type: GrpcDto<ResGetReviewsForProfileDto[]>,
    })
    @ApiBody({
        schema: {
            properties: {
                profileToId: { type: 'number' },
                profileToType: {
                    type: 'string',
                    enum: Object.values(ProfileType),
                },
            },
        },
    })
    @HTTPTrace('ProfileReviewsRpcService.getListForProfile')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getListForProfile(
        @Body() dto: ReqGetReviewsForProfileDto,
    ): Promise<GrpcDto<ResGetReviewsForProfileDto[]>> {
        return this.profileReviewsRpcService.getListForProfile(dto);
    }
}
