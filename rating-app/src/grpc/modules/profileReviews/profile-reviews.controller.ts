import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';
import { ValidationUtils } from '~src/utils/validation.utuls';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ProfileReviewsService } from '~src/grpc/modules/profileReviews/profile-reviews.service';
import { CreateReviewDto } from '~src/data-modules/reviews/dto/createReview.dto';
import { Review } from '~src/data-modules/reviews/entities/review.entity';
import { GetReviewDto } from '~src/data-modules/reviews/dto/getReview.dto';

@Controller('profileReviews')
export class ProfileReviewsController {
    constructor(
        private readonly profileReviewsService: ProfileReviewsService,
    ) {}

    @GrpcMethod('ProfileReviewsRpcService', 'put')
    @GRPCTrace('ProfileReviewsRpcService.put')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async put(createReviewDto: CreateReviewDto): Promise<Review> {
        const dto = await ValidationUtils.validateInput(
            CreateReviewDto,
            createReviewDto,
        );
        return this.profileReviewsService.put(dto);
    }

    @GrpcMethod('ProfileReviewsRpcService', 'getList')
    @GRPCTrace('ProfileReviewsRpcService.getList')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getList(getReviewDto: GetReviewDto): Promise<Review[]> {
        const dto = await ValidationUtils.validateInput(
            GetReviewDto,
            getReviewDto,
        );
        return this.profileReviewsService.getList(dto);
    }
}
