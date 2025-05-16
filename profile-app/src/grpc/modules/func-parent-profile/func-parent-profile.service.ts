import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { ReqCreateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-create-parent-profile.dto';
import { ReqGetParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-get-parent-profile.dto';
import { ReqUpdateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-update-parent-profile.dto';
import { ResGetParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-get-parent-profile.dto';
import { ResUpdateParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-update-parent-profile.dto';
import { ParentProfileService } from '~src/data-modules/parent-profile/parent-profile.service';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class FuncParentProfileService {
    constructor(private readonly parentProfileService: ParentProfileService) {}

    @Trace('FuncParentProfileService.get', { logInput: true, logOutput: true })
    async get(
        getParentProfileDto: ReqGetParentProfileDto,
    ): Promise<ResGetParentProfileDto | null> {
        const resParent: ResGetParentProfileDto | null =
            await this.parentProfileService.get(getParentProfileDto);
        return resParent;
    }

    @Trace('FuncParentProfileService.put', { logInput: true, logOutput: true })
    async put(
        createParentProfileDto: ReqCreateParentProfileDto,
    ): Promise<ResUpdateParentProfileDto | null> {
        const profile = await this.parentProfileService.get({
            id: createParentProfileDto.id,
        });
        if (profile)
            throw new RpcException({
                message: `parent profile with id = ${createParentProfileDto.id} already exists`,
                code: GrpcStatusCode.ALREADY_EXISTS,
            });

        const resParent: ResUpdateParentProfileDto | null =
            await this.parentProfileService.put(createParentProfileDto);
        return resParent;
    }

    @Trace('FuncParentProfileService.update', {
        logInput: true,
        logOutput: true,
    })
    async update(
        updateParentProfileDto: ReqUpdateParentProfileDto,
    ): Promise<ResUpdateParentProfileDto | null> {
        const profile = await this.parentProfileService.get({
            id: updateParentProfileDto.id,
        });
        if (!profile)
            throw new RpcException({
                message: `parent profile with id = ${updateParentProfileDto.id} does not exist`,
                code: GrpcStatusCode.NOT_FOUND,
            });

        const resParent: ResUpdateParentProfileDto | null =
            await this.parentProfileService.update(updateParentProfileDto);
        return resParent;
    }
}
