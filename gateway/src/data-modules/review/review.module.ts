import { Module } from '@nestjs/common';
import { ReviewService } from '~src/data-modules/review/review.service';

@Module({
    imports: [],
    providers: [ReviewService],
    controllers: [],
    exports: [ReviewService],
})
export class ReviewModule {}
