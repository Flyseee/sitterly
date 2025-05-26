import {
    HttpException,
    HttpStatus,
    Injectable,
    OnModuleInit,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { ReqCancelApplicationDto } from '~src/data-modules/application/dto/request-dto/req-cancel-application.dto';
import { ReqCreateApplicationDto } from '~src/data-modules/application/dto/request-dto/req-create-application.dto';
import { ReqGetApplicationDto } from '~src/data-modules/application/dto/request-dto/req-get-application.dto';
import { ResCancelApplicationDto } from '~src/data-modules/application/dto/response-dto/res-cancel-application.dto';
import { ResCreateApplicationDto } from '~src/data-modules/application/dto/response-dto/res-create-application.dto';
import { ResGetApplicationDto } from '~src/data-modules/application/dto/response-dto/res-get-application.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface OrderApplicationRpcService {
    applyOrder(
        createApplicationDto: ReqCreateApplicationDto,
    ): Observable<GrpcDto<ResCreateApplicationDto>>;

    getApplicationsForOrder(
        getApplicationDto: ReqGetApplicationDto,
    ): Observable<GrpcDto<ResGetApplicationDto[]>>;

    cancelOrderApplication(
        cancelApplicationDto: ReqCancelApplicationDto,
    ): Observable<GrpcDto<ResCancelApplicationDto>>;
}

@Injectable()
export class ApplicationService implements OnModuleInit {
    private orderApplicationRpcService: OrderApplicationRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'application',
            protoPath: join(__dirname, '../../grpc/proto/application.proto'),
            url: '89.169.2.227:52055',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.orderApplicationRpcService =
            this.client.getService<OrderApplicationRpcService>(
                'OrderApplicationRpcService',
            );
    }

    @Trace('ApplicationService.applyOrder', {
        logInput: true,
        logOutput: true,
    })
    async applyOrder(
        dto: ReqCreateApplicationDto,
    ): Promise<GrpcDto<ResCreateApplicationDto>> {
        try {
            return lastValueFrom(
                this.orderApplicationRpcService.applyOrder(dto),
            );
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.CONFLICT);
        }
    }

    @Trace('ApplicationService.getApplicationsForOrder', {
        logInput: true,
        logOutput: true,
    })
    async getApplicationsForOrder(
        id: number,
    ): Promise<GrpcDto<ResGetApplicationDto[]>> {
        return lastValueFrom(
            this.orderApplicationRpcService.getApplicationsForOrder({
                orderId: id,
            }),
        );
    }

    @Trace('ApplicationService.cancelOrderApplication', {
        logInput: true,
        logOutput: true,
    })
    cancelOrderApplication(
        id: number,
    ): Promise<GrpcDto<ResCancelApplicationDto>> {
        try {
            return lastValueFrom(
                this.orderApplicationRpcService.cancelOrderApplication({
                    id: id,
                }),
            );
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }
}
