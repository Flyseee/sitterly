import {
    ExpressInstrumentation,
    ExpressLayerType,
} from '@opentelemetry/instrumentation-express';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';
import { TraceService } from '~src/telemetry/trace/trace.service';
import { EVENTS } from '~src/telemetry/trace/const/const';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';

const traceService = new TraceService();

export function getInstrumentations() {
    return [
        new GrpcInstrumentation(),
        new ExpressInstrumentation({
            ignoreLayersType: [
                ExpressLayerType.REQUEST_HANDLER,
                ExpressLayerType.MIDDLEWARE,
                ExpressLayerType.ROUTER,
            ],
            requestHook: (span, req) => {
                span.setAttribute('http.route', req.route || 'unknown');
            },
        }),
        new PgInstrumentation({
            requireParentSpan: true,
            enhancedDatabaseReporting: true,
            requestHook: (span, rq) => {
                if (rq.query) {
                    traceService.event(
                        EVENTS.POSTGRESQL_QUERY,
                        {
                            text: rq.query.text,
                            values: rq.query.values,
                        },
                        span,
                    );
                }
            },
            responseHook: (span, rs) => {
                if (rs.data) {
                    traceService.event(
                        EVENTS.POSTGRESQL_QUERY_RESULT,
                        {
                            command: rs.data.command,
                            rowCount: rs.data.rowCount,
                            rows: rs.data.rows,
                        },
                        span,
                    );
                }
            },
        }),
        new TypeormInstrumentation({
            enableInternalInstrumentation: true,
        }),
    ];
}
