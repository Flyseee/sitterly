import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { TraceService } from '~src/telemetry/trace/trace.service';

@Injectable()
export class GrpcResultWrapperInterceptor implements NestInterceptor {
    constructor(private readonly traceService: TraceService) {}

    intercept(
        exContext: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const data = exContext.switchToRpc().getData();

        return next.handle().pipe(
            map((response) => {
                return {
                    data: response,
                };
            }),
        );
    }
}
