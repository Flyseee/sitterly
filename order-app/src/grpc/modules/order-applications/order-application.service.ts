import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { ApplicationService } from '~src/data-modules/application/application.service';
import { ReqCancelApplicationDto } from '~src/data-modules/application/dto/request-dto/req-cancel-application.dto';
import { ReqCreateApplicationDto } from '~src/data-modules/application/dto/request-dto/req-create-application.dto';
import { ReqGetApplicationDto } from '~src/data-modules/application/dto/request-dto/req-get-application.dto';
import { ResCancelApplicationDto } from '~src/data-modules/application/dto/response-dto/res-cancel-application.dto';
import { ResCreateApplicationDto } from '~src/data-modules/application/dto/response-dto/res-create-application.dto';
import { ResGetApplicationDto } from '~src/data-modules/application/dto/response-dto/res-get-application.dto';
import { SitterProfileDataService } from '~src/data-modules/client/sitter-profile/sitter-profile-data.service';
import { FuncOrderService } from '~src/grpc/modules/func-order/func-order.service';

@Injectable()
export class OrderApplicationService {
    constructor(
        private readonly applicationService: ApplicationService,
        private readonly sitterProfileDataService: SitterProfileDataService,
        private readonly funcOrderService: FuncOrderService,
    ) {}

    async create(
        createApplicationDto: ReqCreateApplicationDto,
    ): Promise<ResCreateApplicationDto> {
        const order = await this.funcOrderService.getOrder({
            id: createApplicationDto.orderId,
        });
        if (!order) {
            throw new RpcException({
                message: `order with id = ${createApplicationDto.orderId} does not exist`,
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        }

        const profile = await this.sitterProfileDataService.get(
            createApplicationDto.sitterId,
        );
        if (profile._error || !profile.data) {
            throw new RpcException({
                message: `sitter profile with id = ${createApplicationDto.sitterId} does not exist`,
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        }

        const resCreateApp: ResCreateApplicationDto =
            await this.applicationService.create(createApplicationDto);
        return resCreateApp;
    }

    async getApplicationsForOrder(
        getApplicationDto: ReqGetApplicationDto,
    ): Promise<ResGetApplicationDto[]> {
        const resGetApp: ResGetApplicationDto[] =
            await this.applicationService.getApplicationsForOrder(
                getApplicationDto,
            );

        return resGetApp;
    }

    async cancel(
        cancelApplicationDto: ReqCancelApplicationDto,
    ): Promise<ResCancelApplicationDto> {
        const application = await this.applicationService.get(
            cancelApplicationDto.id,
        );
        if (!application)
            throw new RpcException({
                message: `application with id = ${cancelApplicationDto.id} not found`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        const resCancelApp: ResCancelApplicationDto =
            await this.applicationService.cancel(cancelApplicationDto);
        return resCancelApp;
    }
}
