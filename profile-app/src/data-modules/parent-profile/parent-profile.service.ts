import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReqCreateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-create-parent-profile.dto';
import { ReqGetParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-get-parent-profile.dto';
import { ReqUpdateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-update-parent-profile.dto';
import { ParentProfile } from '~src/data-modules/parent-profile/entities/parent-profile.entity';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class ParentProfileService {
    constructor(
        @Inject('PARENT_PROFILE_REPOSITORY')
        private parentProfileRepository: Repository<ParentProfile>,
    ) {}

    @Trace('ParentProfileService.get', { logInput: true, logOutput: true })
    get(
        getParentProfileDto: ReqGetParentProfileDto,
    ): Promise<ParentProfile | null> {
        return this.parentProfileRepository.findOneBy({
            id: getParentProfileDto.id,
        });
    }

    @Trace('ParentProfileService.put', { logInput: true, logOutput: true })
    async put(
        createParentProfileDto: ReqCreateParentProfileDto,
    ): Promise<ParentProfile> {
        const entity = this.parentProfileRepository.create(
            createParentProfileDto,
        );
        return await this.parentProfileRepository.save(entity);
    }

    @Trace('ParentProfileService.update', { logInput: true, logOutput: true })
    async update(
        updateParentProfileDto: ReqUpdateParentProfileDto,
    ): Promise<ParentProfile> {
        const entity = this.parentProfileRepository.create(
            updateParentProfileDto,
        );
        return this.parentProfileRepository.save(entity);
    }
}
