import { Module } from '@nestjs/common';
import { RatingService } from '~src/data-modules/rating/rating.service';

@Module({
    imports: [],
    providers: [RatingService],
    controllers: [],
    exports: [RatingService],
})
export class RatingModule {}
