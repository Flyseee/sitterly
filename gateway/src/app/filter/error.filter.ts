import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { grpcToHttpMap } from '~src/app/filter/grpc-to http-exception-code';
import { TraceService } from '~src/telemetry/trace/trace.service';
import { StringUtils } from '~src/utils/string.utils';
import { CustomHttpException } from './http-exceptions.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly traceService: TraceService) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const span = this.traceService.getSpan();
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        const isHttpException = exception instanceof HttpException;
        const isRpcWithCode =
            typeof exception === 'object' &&
            exception !== null &&
            'code' in exception &&
            typeof (exception as any).code === 'number';

        const status: number = isHttpException
            ? (exception as HttpException).getStatus()
            : isRpcWithCode
              ? grpcToHttpMap[(exception as any).code] ||
                HttpStatus.INTERNAL_SERVER_ERROR
              : HttpStatus.INTERNAL_SERVER_ERROR;

        let message: string | object = 'Произошла непредвиденная ошибка.';
        let code: string | null = null;

        if (isHttpException) {
            const responseMessage = (exception as HttpException).getResponse();
            message =
                typeof responseMessage === 'string'
                    ? responseMessage
                    : (responseMessage as CustomHttpException).message ||
                      responseMessage;

            if (exception instanceof CustomHttpException) {
                code = exception.getErrorCode() || null;
            }
        }

        const rsBody = {
            _error: {
                code: code || status,
                text: message,
                details: {
                    time: new Date(),
                    method: request.method,
                    url: `${request.protocol}://${request.hostname}${request.originalUrl}`,
                    definition_name: null,
                    stack: (exception as Error)?.stack ?? null,
                    external_error: null,
                    ...(request.x_request_id
                        ? { x_request_id: request.x_request_id }
                        : {}),
                },
            },
        };

        this.traceService.traceIncomingResponse(
            {
                code: response.statusCode,
                'x-request-id': StringUtils.toString(
                    response.getHeader('x-request-id'),
                ),
                headers: response.getHeaders(),
                body: rsBody,
            },
            span,
        );

        this.traceService.recordException(exception as Error, span);
        span.end();

        response.status(status < 100 ? 500 : status).json(rsBody);
    }
}
