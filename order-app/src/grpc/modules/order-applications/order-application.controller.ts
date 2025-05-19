import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPCTrace } from '~src/app/decorators/grpc-trace.decorator';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ReqCancelApplicationDto } from '~src/data-modules/application/dto/request-dto/req-cancel-application.dto';
import { ReqCreateApplicationDto } from '~src/data-modules/application/dto/request-dto/req-create-application.dto';
import { ReqGetApplicationDto } from '~src/data-modules/application/dto/request-dto/req-get-application.dto';
import { ResCancelApplicationDto } from '~src/data-modules/application/dto/response-dto/res-cancel-application.dto';
import { ResCreateApplicationDto } from '~src/data-modules/application/dto/response-dto/res-create-application.dto';
import { ResGetApplicationDto } from '~src/data-modules/application/dto/response-dto/res-get-application.dto';
import { OrderApplicationService } from '~src/grpc/modules/order-applications/order-application.service';
import { ValidationUtils } from '~src/utils/validation.utuls';

@Controller('orderApplication')
export class OrderApplicationController {
    constructor(
        private readonly orderApplicationService: OrderApplicationService,
    ) {}

    @GrpcMethod('OrderApplicationRpcService', 'applyOrder')
    @GRPCTrace('OrderApplicationRpcService.applyOrder')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async applyOrder(
        createApplicationDto: ReqCreateApplicationDto,
    ): Promise<ResCreateApplicationDto> {
        const dto = await ValidationUtils.validateInput(
            ReqCreateApplicationDto,
            createApplicationDto,
        );
        return this.orderApplicationService.create(dto);
    }

    @GrpcMethod('OrderApplicationRpcService', 'getApplicationsForOrder')
    @GRPCTrace('OrderApplicationRpcService.getApplicationsForOrder')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getApplicationsForOrder(
        getApplicationDto: ReqGetApplicationDto,
    ): Promise<ResGetApplicationDto[]> {
        const dto = await ValidationUtils.validateInput(
            ReqGetApplicationDto,
            getApplicationDto,
        );
        return this.orderApplicationService.getApplicationsForOrder(dto);
    }

    @GrpcMethod('OrderApplicationRpcService', 'cancelOrderApplication')
    @GRPCTrace('OrderApplicationRpcService.cancelOrderApplication')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async cancelOrderApplication(
        cancelApplicationDto: ReqCancelApplicationDto,
    ): Promise<ResCancelApplicationDto> {
        const dto = await ValidationUtils.validateInput(
            ReqCancelApplicationDto,
            cancelApplicationDto,
        );
        return await this.orderApplicationService.cancel(dto);
    }
}
