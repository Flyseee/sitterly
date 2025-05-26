import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    OnModuleInit,
    Patch,
    Post,
    Put,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { join } from 'path';
import { HTTPTrace } from '~src/app/decorators/http-trace.decorator';
import { HttpExceptionFilter } from '~src/app/filter/error.filter';
import { TracingInterceptor } from '~src/app/interceptors/tracing.interceptor';
import { OrderDateType } from '~src/data-modules/enums/order-date-type.enum';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';
import { ReqCreateOrderDto } from '~src/data-modules/order/dto/request-dto/req-create-order.dto';
import { ReqGetOrdersForUserDto } from '~src/data-modules/order/dto/request-dto/req-get-orders-for-user.dto';
import { ReqUpdateOrderDto } from '~src/data-modules/order/dto/request-dto/req-update-order.dto';
import { ResCreateOrderDto } from '~src/data-modules/order/dto/response-dto/res-create-order.dto';
import { ResGetActualOrdersDto } from '~src/data-modules/order/dto/response-dto/res-get-actual-orders.dto';
import { ResGetOrdersForUserDto } from '~src/data-modules/order/dto/response-dto/res-get-orders-for-user.dto';
import { ResUpdateOrderDto } from '~src/data-modules/order/dto/response-dto/res-update-order.dto';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface FuncOrderRpcService {
    getActualOrders({}): Promise<GrpcDto<ResGetActualOrdersDto[]>>;

    getOrdersForUser(
        dto: ReqGetOrdersForUserDto,
    ): Promise<GrpcDto<ResGetOrdersForUserDto[] | undefined>>;

    createOrder(dto: ReqCreateOrderDto): Promise<GrpcDto<ResCreateOrderDto>>;

    updateOrder(
        updateOrderDto: ReqUpdateOrderDto,
    ): Promise<GrpcDto<ResUpdateOrderDto>>;
}

@Controller('funcOrder')
export class FuncOrderController implements OnModuleInit {
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

    @Get('/orders')
    @ApiOperation({
        summary: 'Получить все актуальные заказы',
        operationId: 'get-actual-orders',
    })
    @ApiResponse({
        status: 200,
        description: 'Заказы получены',
        type: GrpcDto<ResGetActualOrdersDto[]>,
    })
    @HTTPTrace('FuncOrderRpcService.getActualOrders')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    getActualOrders(): Promise<GrpcDto<ResGetActualOrdersDto[]>> {
        return this.funcOrderRpcService.getActualOrders({});
    }

    @Post('/orders')
    @ApiOperation({
        summary: 'Получить заказы для пользователя',
        operationId: 'get-orders-for-user',
    })
    @ApiBody({
        schema: {
            properties: {
                id: { type: 'number' },
                profileType: {
                    type: 'string',
                    enum: Object.values(ProfileType),
                },
                orderDateType: {
                    type: 'string',
                    enum: Object.values(OrderDateType),
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Заказы получены',
        type: GrpcDto<ResGetOrdersForUserDto[] | undefined>,
    })
    @HTTPTrace('FuncOrderRpcService.getOrdersForUser')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async getOrdersForUser(
        @Body() dto: ReqGetOrdersForUserDto,
    ): Promise<GrpcDto<ResGetOrdersForUserDto[] | undefined>> {
        return this.funcOrderRpcService.getOrdersForUser(dto);
    }

    @Put('/orders')
    @ApiOperation({
        summary: 'Создать заказ',
        operationId: 'create-order',
    })
    @ApiResponse({
        status: 200,
        description: 'Заказ создан',
        type: GrpcDto<ResCreateOrderDto>,
    })
    @ApiBody({
        schema: {
            properties: {
                parentId: { type: 'number' },
                sitterId: { type: 'number' },
                description: { type: 'string' },
                location: { type: 'string' },
                durationHours: { type: 'number' },
                durationMinutes: { type: 'number' },
                cost: { type: 'number' },
                kidsDescription: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
            },
        },
    })
    @HTTPTrace('FuncOrderRpcService.createOrder')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async createOrder(
        @Body() dto: ReqCreateOrderDto,
    ): Promise<GrpcDto<ResCreateOrderDto>> {
        try {
            return this.funcOrderRpcService.createOrder(dto);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.CONFLICT);
        }
    }

    @Patch('/orders')
    @ApiOperation({
        summary: 'Обновить заказ',
        operationId: 'update-order',
    })
    @ApiResponse({
        status: 200,
        description: 'Заказ обновлен',
        type: GrpcDto<ResUpdateOrderDto>,
    })
    @ApiResponse({ status: 404, description: 'Заказ не найден' })
    @ApiBody({
        schema: {
            properties: {
                id: { type: 'number' },
                sitterId: { type: 'number' },
                description: { type: 'string' },
                location: { type: 'string' },
                durationHours: { type: 'number' },
                durationMinutes: { type: 'number' },
                cost: { type: 'number' },
                kidsDescription: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
            },
        },
    })
    @HTTPTrace('FuncOrderRpcService.updateOrder')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async updateOrder(
        @Body() dto: ReqUpdateOrderDto,
    ): Promise<GrpcDto<ResUpdateOrderDto>> {
        try {
            return this.funcOrderRpcService.updateOrder(dto);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }
}
