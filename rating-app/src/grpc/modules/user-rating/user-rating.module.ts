import { Module } from '@nestjs/common';
import { ParentProfileDataModule } from '~src/data-modules/client/parent-profile/parent-profile-data.module';
import { SitterProfileDataModule } from '~src/data-modules/client/sitter-profile/sitter-profile-data.module';
import { RatingModule } from '~src/data-modules/rating/rating.module';
import { ReviewModule } from '~src/data-modules/review/review.module';
import { UserRatingController } from '~src/grpc/modules/user-rating/user-rating.controller';
import { UserRatingService } from '~src/grpc/modules/user-rating/user-rating.service';

@Module({
    imports: [
        RatingModule,
        ReviewModule,
        SitterProfileDataModule,
        ParentProfileDataModule,
    ],
    providers: [UserRatingService],
    controllers: [UserRatingController],
})
export class UserRatingModule {}
