import * as dotenv from 'dotenv';
import { TelemetryConfig } from './telemetry.config';
import * as path from 'node:path';

dotenv.config({
    path: path.resolve(process.cwd(), 'config', '.env'),
});

export function readTelemetryConfig(): TelemetryConfig {
    return {
        run: true,
        serviceName: process.env.SERVICE_NAME || 'unknown',
        traceCollectorUrl:
            process.env.TRACE_COLLECTOR_URL ||
            'http://localhost:4318/v1/traces',
    };
}
