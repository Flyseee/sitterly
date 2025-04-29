import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { CreateRatingDto } from '~src/data-modules/rating/dto/createRating.dto';
import { GetRatingDto } from '~src/data-modules/rating/dto/getRating.dto';
import { Rating } from '~src/data-modules/rating/entities/rating.entity';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';
import { UserRatingService } from '~src/grpc/modules/userRating/userRating.service';
import { ValidationUtils } from '~src/utils/validation.utuls';

@Controller('userRating')
export class UserRatingController {
    constructor(private readonly userRatingService: UserRatingService) {}

    @GrpcMethod('UserRatingRpcService', 'put')
    @GRPCTrace('UserRatingRpcService.put')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async put(createRatingDto: CreateRatingDto): Promise<Rating> {
        const dto = await ValidationUtils.validateInput(
            CreateRatingDto,
            createRatingDto,
        );
        return this.userRatingService.put(dto);
    }

    @GrpcMethod('UserRatingRpcService', 'get')
    @GRPCTrace('UserRatingRpcService.get')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async get(getRatingDto: GetRatingDto) {
        const dto = await ValidationUtils.validateInput(
            GetRatingDto,
            getRatingDto,
        );
        return this.userRatingService.get(dto);
    }
}
