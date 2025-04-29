import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { CancelApplicationDto } from '~src/data-modules/application/dto/cancel-application.dto';
import { CreateApplicationDto } from '~src/data-modules/application/dto/create-application.dto';
import { GetApplicationDto } from '~src/data-modules/application/dto/get-application.dto';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';
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
    async applyOrder(createApplicationDto: CreateApplicationDto) {
        const dto = await ValidationUtils.validateInput(
            CreateApplicationDto,
            createApplicationDto,
        );
        return this.orderApplicationService.create(dto);
    }

    @GrpcMethod('OrderApplicationRpcService', 'getApplicationsForOrder')
    @GRPCTrace('OrderApplicationRpcService.getApplicationsForOrder')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getApplicationsForOrder(getApplicationDto: GetApplicationDto) {
        const dto = await ValidationUtils.validateInput(
            GetApplicationDto,
            getApplicationDto,
        );
        return this.orderApplicationService.getApplicationsForOrder(dto);
    }

    @GrpcMethod('OrderApplicationRpcService', 'cancelOrderApplication')
    @GRPCTrace('OrderApplicationRpcService.cancelOrderApplication')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async cancelOrderApplication(cancelApplicationDto: CancelApplicationDto) {
        const dto = await ValidationUtils.validateInput(
            CancelApplicationDto,
            cancelApplicationDto,
        );
        await this.orderApplicationService.cancel(dto);
    }
}
