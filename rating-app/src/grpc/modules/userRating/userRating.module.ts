import { Module } from '@nestjs/common';
import { RatingModule } from '~src/data-modules/rating/rating.module';
import { UserRatingController } from '~src/grpc/modules/userRating/userRating.controller';
import { UserRatingService } from '~src/grpc/modules/userRating/userRating.service';

@Module({
    imports: [RatingModule],
    providers: [UserRatingService],
    controllers: [UserRatingController],
})
export class UserRatingModule {}
