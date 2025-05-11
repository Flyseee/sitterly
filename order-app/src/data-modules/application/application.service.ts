import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReqCancelApplicationDto } from '~src/data-modules/application/dto/request-dto/req-cancel-application.dto';
import { ReqCreateApplicationDto } from '~src/data-modules/application/dto/request-dto/req-create-application.dto';
import { ReqGetApplicationDto } from '~src/data-modules/application/dto/request-dto/req-get-application.dto';
import { Application } from '~src/data-modules/application/entities/application.entity';

@Injectable()
export class ApplicationService {
    constructor(
        @Inject('APPLICATION_REPOSITORY')
        private applicationRepository: Repository<Application>,
    ) {}

    get(id: number): Promise<Application | null> {
        return this.applicationRepository.findOneBy({ id });
    }

    create(
        createApplicationDto: ReqCreateApplicationDto,
    ): Promise<Application> {
        const entity = this.applicationRepository.create(createApplicationDto);
        return this.applicationRepository.save(entity);
    }

    async getApplicationsForOrder(
        getApplicationDto: ReqGetApplicationDto,
    ): Promise<Application[]> {
        return await this.applicationRepository.findBy({
            orderId: getApplicationDto.orderId,
        });
    }

    async cancel(
        cancelApplicationDto: ReqCancelApplicationDto,
    ): Promise<Application> {
        const entity = this.applicationRepository.create({
            id: cancelApplicationDto.id,
            isActual: false,
        });
        return this.applicationRepository.save(entity);
    }
}
