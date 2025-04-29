import { Module } from '@nestjs/common';
import reviewRepositoryProvider from '~src/data-modules/review/provider/review-repository-provider';
import { ReviewService } from '~src/data-modules/review/review.service';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';

@Module({
    imports: [PostgresqlModule],
    providers: [ReviewService, reviewRepositoryProvider],
    exports: [ReviewService],
})
export class ReviewModule {}
