import { Module } from '@nestjs/common';
import { ProfileReviewsController } from '~src/http/profile-reviews/profile-reviews.controller';

@Module({
    imports: [],
    providers: [],
    controllers: [ProfileReviewsController],
})
export class ProfileReviewsModule {}
