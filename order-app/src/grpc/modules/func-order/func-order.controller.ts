import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { CreateOrderDto } from '~src/data-modules/order/dto/create-order.dto';
import { GetOrdersForUserDto } from '~src/data-modules/order/dto/get-orders-for-user.dto';
import { UpdateOrderDto } from '~src/data-modules/order/dto/update-order.dto';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';
import { FuncOrderService } from '~src/grpc/modules/func-order/func-order.service';
import { ValidationUtils } from '~src/utils/validation.utuls';

@Controller('funcOrder')
export class FuncOrderController {
    constructor(private readonly funcOrderService: FuncOrderService) {}

    @GrpcMethod('FuncOrderRpcService', 'getActualOrders')
    @GRPCTrace('FuncOrderRpcService.getActualOrders')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    getActualOrders() {
        return this.funcOrderService.getActualOrders();
    }

    @GrpcMethod('FuncOrderRpcService', 'getActualOrdersForUser')
    @GRPCTrace('FuncOrderRpcService.getActualOrdersForUser')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getActualOrdersForUser(getOrdersForUserDto: GetOrdersForUserDto) {
        const dto = await ValidationUtils.validateInput(
            GetOrdersForUserDto,
            getOrdersForUserDto,
        );
        return this.funcOrderService.getActualOrdersForUser(dto);
    }

    @GrpcMethod('FuncOrderRpcService', 'getPassedOrdersForUser')
    @GRPCTrace('FuncOrderRpcService.getPassedOrdersForUser')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getPassedOrdersForUser(getOrdersForUserDto: GetOrdersForUserDto) {
        const dto = await ValidationUtils.validateInput(
            GetOrdersForUserDto,
            getOrdersForUserDto,
        );
        return this.funcOrderService.getPassedOrdersForUser(dto);
    }

    @GrpcMethod('FuncOrderRpcService', 'createOrder')
    @GRPCTrace('FuncOrderRpcService.createOrder')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async createOrder(createOrderDto: CreateOrderDto) {
        const dto = await ValidationUtils.validateInput(
            CreateOrderDto,
            createOrderDto,
        );
        return this.funcOrderService.createOrder(dto);
    }

    @GrpcMethod('FuncOrderRpcService', 'updateOrder')
    @GRPCTrace('FuncOrderRpcService.updateOrder')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async updateOrder(updateOrderDto: UpdateOrderDto) {
        const dto = await ValidationUtils.validateInput(
            UpdateOrderDto,
            updateOrderDto,
        );
        return this.funcOrderService.updateOrder(dto);
    }
}
