import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { CreateRatingDto } from '~src/data-modules/rating/dto/createRating.dto';
import { UserRatingService } from '~src/grpc/modules/userRating/userRating.service';
import { CalcRatingDto } from '~src/data-modules/rating/dto/calcRating.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';
import { Rating } from '~src/data-modules/rating/entities/rating.entity';
import { ValidationUtils } from '~src/utils/validation.utuls';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';

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
    get({ id }: { id: number }) {
        return this.userRatingService.get(id);
    }

    @GrpcMethod('UserRatingRpcService', 'update')
    @GRPCTrace('UserRatingRpcService.update')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async update(data: { id: number; calcRatingDto: CalcRatingDto }) {
        const dto = await ValidationUtils.validateInput(
            CalcRatingDto,
            data.calcRatingDto,
        );

        return this.userRatingService.update(data.id, dto);
    }
}
