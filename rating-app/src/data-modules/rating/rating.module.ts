import { Module } from '@nestjs/common';
import ratingRepositoryProvider from '~src/data-modules/rating/provider/rating-repository-provider';
import { RatingService } from '~src/data-modules/rating/rating.service';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';

@Module({
    imports: [PostgresqlModule],
    providers: [RatingService, ratingRepositoryProvider],
    exports: [RatingService],
})
export class RatingModule {}
