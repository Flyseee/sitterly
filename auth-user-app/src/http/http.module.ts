import { Module } from '@nestjs/common';
import { HealthcheckModule } from '~src/http/modules/healthcheck/healthcheck.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserInfoTestModule } from '~src/http/modules/user-info-test/user-info-test.module';

@Module({
    imports: [HealthcheckModule, AuthModule, UserInfoTestModule],
})
export class HttpModule {}
