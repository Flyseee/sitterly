import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPCTrace } from '~src/app/decorators/grpc-trace.decorator';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ReqCreateOrderDto } from '~src/data-modules/order/dto/request-dto/req-create-order.dto';
import { ReqGetOrdersForUserDto } from '~src/data-modules/order/dto/request-dto/req-get-orders-for-user.dto';
import { ReqUpdateOrderDto } from '~src/data-modules/order/dto/request-dto/req-update-order.dto';
import { ResCreateOrderDto } from '~src/data-modules/order/dto/response-dto/res-create-order.dto';
import { ResGetActualOrdersDto } from '~src/data-modules/order/dto/response-dto/res-get-actual-orders.dto';
import { ResGetOrdersForUserDto } from '~src/data-modules/order/dto/response-dto/res-get-orders-for-user.dto';
import { ResUpdateOrderDto } from '~src/data-modules/order/dto/response-dto/res-update-order.dto';
import { FuncOrderService } from '~src/grpc/modules/func-order/func-order.service';
import { ValidationUtils } from '~src/utils/validation.utuls';

@Controller('funcOrder')
export class FuncOrderController {
    constructor(private readonly funcOrderService: FuncOrderService) {}

    @GrpcMethod('FuncOrderRpcService', 'getActualOrders')
    @GRPCTrace('FuncOrderRpcService.getActualOrders')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    getActualOrders(): Promise<ResGetActualOrdersDto[]> {
        return this.funcOrderService.getActualOrders();
    }

    @GrpcMethod('FuncOrderRpcService', 'getOrdersForUser')
    @GRPCTrace('FuncOrderRpcService.getOrdersForUser')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getOrdersForUser(
        getOrdersForUserDto: ReqGetOrdersForUserDto,
    ): Promise<ResGetOrdersForUserDto[] | undefined> {
        const dto = await ValidationUtils.validateInput(
            ReqGetOrdersForUserDto,
            getOrdersForUserDto,
        );
        return this.funcOrderService.getOrdersForUser(dto);
    }

    @GrpcMethod('FuncOrderRpcService', 'createOrder')
    @GRPCTrace('FuncOrderRpcService.createOrder')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async createOrder(
        createOrderDto: ReqCreateOrderDto,
    ): Promise<ResCreateOrderDto> {
        const dto = await ValidationUtils.validateInput(
            ReqCreateOrderDto,
            createOrderDto,
        );
        return this.funcOrderService.createOrder(dto);
    }

    @GrpcMethod('FuncOrderRpcService', 'updateOrder')
    @GRPCTrace('FuncOrderRpcService.updateOrder')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async updateOrder(
        updateOrderDto: ReqUpdateOrderDto,
    ): Promise<ResUpdateOrderDto> {
        const dto = await ValidationUtils.validateInput(
            ReqUpdateOrderDto,
            updateOrderDto,
        );
        return this.funcOrderService.updateOrder(dto);
    }
}
