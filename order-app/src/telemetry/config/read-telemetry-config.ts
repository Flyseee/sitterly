import * as dotenv from 'dotenv';
import * as path from 'node:path';
import * as process from 'node:process';
import { TelemetryConfig } from './telemetry.config';

dotenv.config({
    path: path.resolve(process.cwd(), 'config', '.env'),
});

console.log(process.env.TRACE_COLLECTOR_URL);
export function readTelemetryConfig(): TelemetryConfig {
    return {
        run: true,
        serviceName: process.env.SERVICE_NAME || 'unknown',
        traceCollectorUrl:
            process.env.TRACE_COLLECTOR_URL || 'http://jaeger:4318/v1/traces',
    };
}
