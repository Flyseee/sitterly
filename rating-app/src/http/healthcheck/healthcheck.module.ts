import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthcheckController } from './healthcheck.controller';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [TerminusModule, PostgresqlModule, CacheModule.register({})],
    controllers: [HealthcheckController],
})
export class HealthcheckModule {}
