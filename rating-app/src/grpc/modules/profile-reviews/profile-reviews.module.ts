import { Module } from '@nestjs/common';
import { ParentProfileDataModule } from '~src/data-modules/client/parent-profile/parent-profile-data.module';
import { SitterProfileDataModule } from '~src/data-modules/client/sitter-profile/sitter-profile-data.module';
import { ReviewModule } from '~src/data-modules/review/review.module';
import { ProfileReviewsController } from '~src/grpc/modules/profile-reviews/profile-reviews.controller';
import { ProfileReviewsService } from '~src/grpc/modules/profile-reviews/profile-reviews.service';

@Module({
    imports: [ReviewModule, SitterProfileDataModule, ParentProfileDataModule],
    providers: [ProfileReviewsService],
    controllers: [ProfileReviewsController],
})
export class ProfileReviewsModule {}
