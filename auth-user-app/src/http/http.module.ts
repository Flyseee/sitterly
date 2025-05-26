import { Module } from '@nestjs/common';
import { HealthcheckModule } from '~src/http/modules/healthcheck/healthcheck.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [HealthcheckModule, AuthModule],
})
export class HttpModule {}
