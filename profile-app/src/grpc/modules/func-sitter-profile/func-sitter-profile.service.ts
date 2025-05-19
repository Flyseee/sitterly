import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { ReqCreateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-create-sitter-profile.dto';
import { ReqGetSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-get-sitter-profile.dto';
import { ReqUpdateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-update-sitter-profile.dto';
import { ResGetSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-get-sitter-profile.dto';
import { ResUpdateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-update-sitter-profile.dto';
import { SitterProfileService } from '~src/data-modules/sitter-profile/sitter-profile.service';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class FuncSitterProfileService {
    constructor(private readonly sitterProfileService: SitterProfileService) {}

    @Trace('FuncSitterProfileService.get', { logInput: true, logOutput: true })
    async get(
        getSitterProfileDto: ReqGetSitterProfileDto,
    ): Promise<ResGetSitterProfileDto | null> {
        const resSitter: ResGetSitterProfileDto | null =
            await this.sitterProfileService.get(getSitterProfileDto);
        return resSitter;
    }

    @Trace('FuncSitterProfileService.put', { logInput: true, logOutput: true })
    async put(
        createSitterProfileDto: ReqCreateSitterProfileDto,
    ): Promise<ResUpdateSitterProfileDto | null> {
        const resSitter: ResUpdateSitterProfileDto | null =
            await this.sitterProfileService.put(createSitterProfileDto);
        return resSitter;
    }

    @Trace('FuncSitterProfileService.update', {
        logInput: true,
        logOutput: true,
    })
    async update(
        updateSitterProfileDto: ReqUpdateSitterProfileDto,
    ): Promise<ResUpdateSitterProfileDto | null> {
        const profile = await this.sitterProfileService.get({
            id: updateSitterProfileDto.id,
        });
        if (!profile)
            throw new RpcException({
                message: `sitter profile with id = ${updateSitterProfileDto.id} does not exist`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        const resSitter: ResUpdateSitterProfileDto | null =
            await this.sitterProfileService.update(updateSitterProfileDto);
        return resSitter;
    }
}
