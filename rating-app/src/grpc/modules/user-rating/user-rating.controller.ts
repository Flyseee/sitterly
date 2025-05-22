import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPCTrace } from '~src/app/decorators/grpc-trace.decorator';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ReqCreateRatingDto } from '~src/data-modules/rating/dto/request-dto/req-create-rating.dto';
import { ReqGetRatingDto } from '~src/data-modules/rating/dto/request-dto/req-get-rating.dto';
import { ResCreateRatingDto } from '~src/data-modules/rating/dto/response-dto/res-create-rating.dto';
import { ResGetRatingDto } from '~src/data-modules/rating/dto/response-dto/res-get-rating.dto';
import { UserRatingService } from '~src/grpc/modules/user-rating/user-rating.service';
import { ValidationUtils } from '~src/utils/validation.utils';

@Controller('userRating')
export class UserRatingController {
    constructor(private readonly userRatingService: UserRatingService) {}

    @GrpcMethod('UserRatingRpcService', 'put')
    @GRPCTrace('UserRatingRpcService.put')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async put(
        createRatingDto: ReqCreateRatingDto,
    ): Promise<ResCreateRatingDto> {
        const dto = await ValidationUtils.validateInput(
            ReqCreateRatingDto,
            createRatingDto,
        );
        return this.userRatingService.put(dto);
    }

    @GrpcMethod('UserRatingRpcService', 'get')
    @GRPCTrace('UserRatingRpcService.get')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async get(getRatingDto: ReqGetRatingDto): Promise<ResGetRatingDto> {
        const dto = await ValidationUtils.validateInput(
            ReqGetRatingDto,
            getRatingDto,
        );
        return this.userRatingService.get(dto);
    }
}
