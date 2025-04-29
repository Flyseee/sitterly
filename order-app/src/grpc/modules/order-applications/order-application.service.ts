import { Injectable } from '@nestjs/common';
import { ApplicationService } from '~src/data-modules/application/application.service';
import { CancelApplicationDto } from '~src/data-modules/application/dto/cancel-application.dto';
import { CreateApplicationDto } from '~src/data-modules/application/dto/create-application.dto';
import { GetApplicationDto } from '~src/data-modules/application/dto/get-application.dto';

@Injectable()
export class OrderApplicationService {
    constructor(private readonly applicationService: ApplicationService) {}

    create(createApplicationDto: CreateApplicationDto) {
        return this.applicationService.create(createApplicationDto);
    }

    async getApplicationsForOrder(getApplicationDto: GetApplicationDto) {
        return await this.applicationService.getApplicationsForOrder(
            getApplicationDto,
        );
    }

    async cancel(cancelApplicationDto: CancelApplicationDto) {
        await this.applicationService.cancel(cancelApplicationDto);
    }
}
