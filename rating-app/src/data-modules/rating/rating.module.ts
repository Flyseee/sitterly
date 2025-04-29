import { Module } from '@nestjs/common';
import RatingRepositoryProvider from '~src/data-modules/rating/provider/rating-repository-provider';
import { RatingService } from '~src/data-modules/rating/rating.service';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';

@Module({
    imports: [PostgresqlModule],
    providers: [RatingService, RatingRepositoryProvider],
    exports: [RatingService],
})
export class RatingModule {}
