import { Module } from '@nestjs/common';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';
import { ReviewService } from '~src/data-modules/reviews/review.service';
import reviewRepositoryProvider from '~src/data-modules/reviews/provider/review-repository-provider';

@Module({
    imports: [PostgresqlModule],
    providers: [ReviewService, reviewRepositoryProvider],
    exports: [ReviewService],
})
export class ReviewModule {}
