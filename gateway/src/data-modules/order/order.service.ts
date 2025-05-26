import {
    HttpException,
    HttpStatus,
    Injectable,
    OnModuleInit,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { ReqCreateOrderDto } from '~src/data-modules/order/dto/request-dto/req-create-order.dto';
import { ReqGetOrdersForUserDto } from '~src/data-modules/order/dto/request-dto/req-get-orders-for-user.dto';
import { ReqUpdateOrderDto } from '~src/data-modules/order/dto/request-dto/req-update-order.dto';
import { ResCreateOrderDto } from '~src/data-modules/order/dto/response-dto/res-create-order.dto';
import { ResGetActualOrdersDto } from '~src/data-modules/order/dto/response-dto/res-get-actual-orders.dto';
import { ResGetOrdersForUserDto } from '~src/data-modules/order/dto/response-dto/res-get-orders-for-user.dto';
import { ResUpdateOrderDto } from '~src/data-modules/order/dto/response-dto/res-update-order.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface FuncOrderRpcService {
    getActualOrders({}): Observable<GrpcDto<ResGetActualOrdersDto[]>>;

    getOrdersForUser(
        dto: ReqGetOrdersForUserDto,
    ): Observable<GrpcDto<ResGetOrdersForUserDto[] | undefined>>;

    createOrder(dto: ReqCreateOrderDto): Observable<GrpcDto<ResCreateOrderDto>>;

    updateOrder(
        updateOrderDto: ReqUpdateOrderDto,
    ): Observable<GrpcDto<ResUpdateOrderDto>>;
}

@Injectable()
export class OrderService implements OnModuleInit {
    private funcOrderRpcService: FuncOrderRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'order',
            protoPath: join(__dirname, '../../grpc/proto/order.proto'),
            url: '89.169.2.227:52055',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.funcOrderRpcService = this.client.getService<FuncOrderRpcService>(
            'FuncOrderRpcService',
        );
    }

    @Trace('OrderService.getActualOrders', {
        logInput: true,
        logOutput: true,
    })
    getActualOrders(): Promise<GrpcDto<ResGetActualOrdersDto[]>> {
        return lastValueFrom(this.funcOrderRpcService.getActualOrders({}));
    }

    @Trace('OrderService.getOrdersForUser', {
        logInput: true,
        logOutput: true,
    })
    async getOrdersForUser(
        dto: ReqGetOrdersForUserDto,
    ): Promise<GrpcDto<ResGetOrdersForUserDto[] | undefined>> {
        return lastValueFrom(this.funcOrderRpcService.getOrdersForUser(dto));
    }

    @Trace('OrderService.createOrder', {
        logInput: true,
        logOutput: true,
    })
    async createOrder(
        dto: ReqCreateOrderDto,
    ): Promise<GrpcDto<ResCreateOrderDto>> {
        try {
            return lastValueFrom(this.funcOrderRpcService.createOrder(dto));
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.CONFLICT);
        }
    }

    @Trace('OrderService.updateOrder', {
        logInput: true,
        logOutput: true,
    })
    async updateOrder(
        dto: ReqUpdateOrderDto,
    ): Promise<GrpcDto<ResUpdateOrderDto>> {
        try {
            return lastValueFrom(this.funcOrderRpcService.updateOrder(dto));
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }
}
