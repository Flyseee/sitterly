import { Module } from '@nestjs/common';
import { ApplicationService } from '~src/data-modules/application/application.service';
import ApplicationRepositoryProvider from '~src/data-modules/application/provider/application-repository-provider';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';

@Module({
    imports: [PostgresqlModule],
    providers: [ApplicationService, ApplicationRepositoryProvider],
    exports: [ApplicationService],
})
export class ApplicationModule {}
