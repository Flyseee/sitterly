import { Module } from '@nestjs/common';
import { RatingModule } from '~src/data-modules/rating/rating.module';
import { ReviewModule } from '~src/data-modules/reviews/review.module';
import { UserRatingController } from '~src/grpc/modules/userRating/user-rating.controller';
import { UserRatingService } from '~src/grpc/modules/userRating/user-rating.service';

@Module({
    imports: [RatingModule, ReviewModule],
    providers: [UserRatingService],
    controllers: [UserRatingController],
})
export class UserRatingModule {}
