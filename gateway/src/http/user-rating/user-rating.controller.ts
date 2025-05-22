import {
    Controller,
    Get,
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
import { ReqCreateRatingDto } from '~src/data-modules/rating/request-dto/req-create-rating.dto';
import { ReqGetRatingDto } from '~src/data-modules/rating/request-dto/req-get-rating.dto';
import { ResCreateRatingDto } from '~src/data-modules/rating/response-dto/res-create-rating.dto';
import { ResGetRatingDto } from '~src/data-modules/rating/response-dto/res-get-rating.dto';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface UserRatingRpcService {
    put(dto: ReqCreateRatingDto): Promise<GrpcDto<ResCreateRatingDto>>;

    get(dto: ReqGetRatingDto): Promise<GrpcDto<ResGetRatingDto>>;
}

@Controller('userRating')
export class UserRatingController {
    private userRatingRpcService: UserRatingRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'rating',
            protoPath: join(__dirname, '../../grpc/proto/rating.proto'),
            url: '89.169.2.227:54055',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.userRatingRpcService =
            this.client.getService<UserRatingRpcService>(
                'UserRatingRpcService',
            );
    }

    @Get('/rating')
    @ApiOperation({
        summary: 'Создать рейтинг для профиля',
        operationId: 'create-profile-rating',
    })
    @ApiResponse({
        status: 200,
        description: 'Рейтинг создан',
        type: GrpcDto<ResCreateRatingDto>,
    })
    @ApiBody({
        schema: {
            properties: {
                profileId: { type: 'number' },
                profileType: {
                    type: 'string',
                    enum: Object.values(ProfileType),
                },
                rating: { type: 'number' },
                reviewsAmount: { type: 'number' },
            },
        },
    })
    @HTTPTrace('UserRatingRpcService.put')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async put(dto: ReqCreateRatingDto): Promise<GrpcDto<ResCreateRatingDto>> {
        return this.userRatingRpcService.put(dto);
    }

    @Put('/rating')
    @ApiOperation({
        summary: 'Получить рейтинг профиля',
        operationId: 'get-profile-rating',
    })
    @ApiBody({
        schema: {
            properties: {
                profileId: { type: 'number' },
                profileType: {
                    type: 'string',
                    enum: Object.values(ProfileType),
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Рейтинг получен',
        type: GrpcDto<ResGetRatingDto>,
    })
    @HTTPTrace('UserRatingRpcService.get')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async get(dto: ReqGetRatingDto): Promise<GrpcDto<ResGetRatingDto>> {
        return this.userRatingRpcService.get(dto);
    }
}
