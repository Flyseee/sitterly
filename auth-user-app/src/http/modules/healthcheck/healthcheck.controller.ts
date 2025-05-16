import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService as TermHealthCheckService,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Controller('healthcheck')
export class HealthcheckController {
    constructor(
        private health: TermHealthCheckService,
        private db: TypeOrmHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    @Trace('Healthcheck.check', { logInput: true, logOutput: true })
    check() {
        return this.health.check([() => this.db.pingCheck('database')]);
    }
}
