import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { ApplicationService } from '~src/data-modules/application/application.service';
import { CancelApplicationDto } from '~src/data-modules/application/dto/cancel-application.dto';
import { CreateApplicationDto } from '~src/data-modules/application/dto/create-application.dto';
import { GetApplicationDto } from '~src/data-modules/application/dto/get-application.dto';

@Injectable()
export class OrderApplicationService {
    constructor(private readonly applicationService: ApplicationService) {}

    async create(createApplicationDto: CreateApplicationDto) {
        const application = await this.applicationService.get(
            createApplicationDto.id,
        );
        if (application)
            throw new RpcException({
                message: `Application with id = ${createApplicationDto.id} already exists`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        return this.applicationService.create(createApplicationDto);
    }

    async getApplicationsForOrder(getApplicationDto: GetApplicationDto) {
        return await this.applicationService.getApplicationsForOrder(
            getApplicationDto,
        );
    }

    async cancel(cancelApplicationDto: CancelApplicationDto) {
        return await this.applicationService.cancel(cancelApplicationDto);
    }
}
