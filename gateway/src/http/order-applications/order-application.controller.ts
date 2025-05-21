import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    OnModuleInit,
    Param,
    Put,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { join } from 'path';
import { HTTPTrace } from '~src/app/decorators/http-trace.decorator';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ReqCancelApplicationDto } from '~src/data-modules/application/dto/request-dto/req-cancel-application.dto';
import { ReqCreateApplicationDto } from '~src/data-modules/application/dto/request-dto/req-create-application.dto';
import { ReqGetApplicationDto } from '~src/data-modules/application/dto/request-dto/req-get-application.dto';
import { ResCancelApplicationDto } from '~src/data-modules/application/dto/response-dto/res-cancel-application.dto';
import { ResCreateApplicationDto } from '~src/data-modules/application/dto/response-dto/res-create-application.dto';
import { ResGetApplicationDto } from '~src/data-modules/application/dto/response-dto/res-get-application.dto';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface OrderApplicationRpcService {
    applyOrder(
        createApplicationDto: ReqCreateApplicationDto,
    ): Promise<GrpcDto<ResCreateApplicationDto>>;

    getApplicationsForOrder(
        getApplicationDto: ReqGetApplicationDto,
    ): Promise<GrpcDto<ResGetApplicationDto[]>>;

    cancelOrderApplication(
        cancelApplicationDto: ReqCancelApplicationDto,
    ): Promise<GrpcDto<ResCancelApplicationDto>>;
}

@Controller('orderApplication')
export class OrderApplicationController implements OnModuleInit {
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

    @Put('/applications')
    @ApiOperation({
        summary: 'Создать заявку на заказ',
        operationId: 'create-application',
    })
    @ApiResponse({
        status: 200,
        description: 'Заявка создана',
        type: GrpcDto<ResCreateApplicationDto>,
    })
    @ApiResponse({ status: 409, description: 'Заявка уже существует' })
    @ApiBody({
        schema: {
            properties: {
                id: { type: 'number' },
                orderId: { type: 'number' },
                sitterId: { type: 'number' },
            },
        },
    })
    @HTTPTrace('OrderApplicationRpcService.applyOrder')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async applyOrder(
        @Body() dto: ReqCreateApplicationDto,
    ): Promise<GrpcDto<ResCreateApplicationDto>> {
        try {
            return this.orderApplicationRpcService.applyOrder(dto);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.CONFLICT);
        }
    }

    @Get('/applications/:id')
    @ApiOperation({
        summary: 'Получить заявки на заказ по ID заказа',
        operationId: 'get-apps-for-order-id',
    })
    @ApiParam({ name: 'id', type: 'number', description: 'ID заказа' })
    @ApiResponse({
        status: 200,
        description: 'Заявки на заказ найдены',
        type: GrpcDto<ResGetApplicationDto[]>,
    })
    @HTTPTrace('OrderApplicationRpcService.getApplicationsForOrder')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getApplicationsForOrder(
        @Param('id') id: string,
    ): Promise<GrpcDto<ResGetApplicationDto[]>> {
        return this.orderApplicationRpcService.getApplicationsForOrder({
            orderId: +id,
        });
    }

    @Get('/applications/cancel/:id')
    @ApiOperation({
        summary: 'Отменить заявку на заказ',
        operationId: 'cancel-application',
    })
    @ApiParam({ name: 'id', type: 'number', description: 'ID заявки' })
    @ApiResponse({
        status: 200,
        description: 'Заявка на заказ отменена',
        type: GrpcDto<ResCancelApplicationDto>,
    })
    @ApiResponse({ status: 404, description: 'Заявка не найдена' })
    @HTTPTrace('OrderApplicationRpcService.cancelOrderApplication')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async cancelOrderApplication(
        @Param('id') id: string,
    ): Promise<GrpcDto<ResCancelApplicationDto>> {
        try {
            return await this.orderApplicationRpcService.cancelOrderApplication(
                {
                    id: +id,
                },
            );
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }
}
