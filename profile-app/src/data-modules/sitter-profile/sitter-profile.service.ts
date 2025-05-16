import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReqCreateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-create-sitter-profile.dto';
import { ReqGetSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-get-sitter-profile.dto';
import { ReqUpdateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-update-sitter-profile.dto';
import { SitterProfile } from '~src/data-modules/sitter-profile/entities/sitter-profile.entity';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class SitterProfileService {
    constructor(
        @Inject('SITTER_PROFILE_REPOSITORY')
        private sitterProfileRepository: Repository<SitterProfile>,
    ) {}

    @Trace('SitterProfileService.get', { logInput: true, logOutput: true })
    get(
        getSitterProfileDto: ReqGetSitterProfileDto,
    ): Promise<SitterProfile | null> {
        return this.sitterProfileRepository.findOneBy({
            id: getSitterProfileDto.id,
        });
    }

    @Trace('SitterProfileService.put', { logInput: true, logOutput: true })
    async put(
        createSitterProfileDto: ReqCreateSitterProfileDto,
    ): Promise<SitterProfile> {
        const entity = this.sitterProfileRepository.create(
            createSitterProfileDto,
        );
        return await this.sitterProfileRepository.save(entity);
    }

    @Trace('SitterProfileService.update', { logInput: true, logOutput: true })
    async update(
        updateSitterProfileDto: ReqUpdateSitterProfileDto,
    ): Promise<SitterProfile> {
        const entity = this.sitterProfileRepository.create(
            updateSitterProfileDto,
        );
        return this.sitterProfileRepository.save(entity);
    }
}
