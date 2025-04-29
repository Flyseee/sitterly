import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CancelApplicationDto } from '~src/data-modules/application/dto/cancel-application.dto';
import { CreateApplicationDto } from '~src/data-modules/application/dto/create-application.dto';
import { GetApplicationDto } from '~src/data-modules/application/dto/get-application.dto';
import { Application } from '~src/data-modules/application/entities/application.entity';

@Injectable()
export class ApplicationService {
    constructor(
        @Inject('APPLICATION_REPOSITORY')
        private applicationRepository: Repository<Application>,
    ) {}

    create(createApplicationDto: CreateApplicationDto) {
        const entity = this.applicationRepository.create(createApplicationDto);
        return this.applicationRepository.save(entity);
    }

    async getApplicationsForOrder(getApplicationDto: GetApplicationDto) {
        return await this.applicationRepository.findBy({
            orderId: getApplicationDto.orderId,
        });
    }

    async cancel(cancelApplicationDto: CancelApplicationDto) {
        await this.applicationRepository.update(
            { id: cancelApplicationDto.id },
            { isActual: false },
        );
    }
}
