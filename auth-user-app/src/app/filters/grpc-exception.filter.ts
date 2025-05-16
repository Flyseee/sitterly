import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import { GrpcStatusCode } from '~src/app/filters/grpc-status-code.enum';
import { TraceService } from '~src/telemetry/trace/trace.service';

interface ErrorResponse {
    data: null;
    _error: {
        code: number;
        message: string;
    };
}

@Catch() // перехватываем все исключения
export class GrpcExceptionFilter implements RpcExceptionFilter {
    constructor(private readonly traceService: TraceService) {}

    catch(exception: unknown): Observable<any> {
        const span = this.traceService.getSpan();

        let errorResponse: ErrorResponse = {
            data: null,
            _error: {
                code: GrpcStatusCode.UNKNOWN,
                message: 'unexpected error occurred',
            },
        };

        if (exception instanceof RpcException) {
            const err = exception.getError();
            if (typeof err === 'object' && err !== null) {
                const code =
                    typeof (err as any).code === 'number'
                        ? (err as any).code
                        : this.getErrorCodeFromString((err as any).code);
                errorResponse = {
                    data: null,
                    _error: {
                        code,
                        message: (err as any).message || 'RPC error occurred',
                    },
                };
            } else {
                errorResponse = {
                    data: null,
                    _error: {
                        code: GrpcStatusCode.UNKNOWN,
                        message: err.toString(),
                    },
                };
            }
        } else if (exception instanceof Error) {
            const errorCode =
                typeof (exception as any).code === 'number'
                    ? (exception as any).code
                    : this.getErrorCode(exception);
            errorResponse = {
                data: null,
                _error: {
                    code: errorCode,
                    message: exception.message,
                },
            };
        }

        this.traceService.recordException(exception as Error, span);
        span.end();
        return of(errorResponse);
    }

    private getErrorCode(exception: Error): number {
        const errorMap: Record<string, number> = {
            BadRequestException: GrpcStatusCode.INVALID_ARGUMENT,
            NotFoundException: GrpcStatusCode.NOT_FOUND,
            UnauthorizedException: GrpcStatusCode.UNAUTHENTICATED,
            ForbiddenException: GrpcStatusCode.PERMISSION_DENIED,
            ConflictException: GrpcStatusCode.ALREADY_EXISTS,
            InternalServerErrorException: GrpcStatusCode.INTERNAL,
        };

        return errorMap[exception.name] || GrpcStatusCode.INTERNAL;
    }

    private getErrorCodeFromString(code: string): number {
        const codeMap: Record<string, number> = {
            OK: GrpcStatusCode.OK,
            CANCELLED: GrpcStatusCode.CANCELLED,
            UNKNOWN: GrpcStatusCode.UNKNOWN,
            INVALID_ARGUMENT: GrpcStatusCode.INVALID_ARGUMENT,
            DEADLINE_EXCEEDED: GrpcStatusCode.DEADLINE_EXCEEDED,
            NOT_FOUND: GrpcStatusCode.NOT_FOUND,
            ALREADY_EXISTS: GrpcStatusCode.ALREADY_EXISTS,
            PERMISSION_DENIED: GrpcStatusCode.PERMISSION_DENIED,
            RESOURCE_EXHAUSTED: GrpcStatusCode.RESOURCE_EXHAUSTED,
            FAILED_PRECONDITION: GrpcStatusCode.FAILED_PRECONDITION,
            ABORTED: GrpcStatusCode.ABORTED,
            OUT_OF_RANGE: GrpcStatusCode.OUT_OF_RANGE,
            UNIMPLEMENTED: GrpcStatusCode.UNIMPLEMENTED,
            INTERNAL: GrpcStatusCode.INTERNAL,
            UNAVAILABLE: GrpcStatusCode.UNAVAILABLE,
            DATA_LOSS: GrpcStatusCode.DATA_LOSS,
            UNAUTHENTICATED: GrpcStatusCode.UNAUTHENTICATED,
        };

        return codeMap[code] || GrpcStatusCode.INTERNAL;
    }
}
