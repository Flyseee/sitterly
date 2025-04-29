import { Module } from '@nestjs/common';
import { ReviewModule } from '~src/data-modules/review/review.module';
import { ProfileReviewsController } from '~src/grpc/modules/profileReviews/profile-reviews.controller';
import { ProfileReviewsService } from '~src/grpc/modules/profileReviews/profile-reviews.service';

@Module({
    imports: [ReviewModule],
    providers: [ProfileReviewsService],
    controllers: [ProfileReviewsController],
})
export class ProfileReviewsModule {}
