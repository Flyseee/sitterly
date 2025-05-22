import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPCTrace } from '~src/app/decorators/grpc-trace.decorator';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ReqCreateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-create-parent-profile.dto';
import { ReqGetParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-get-parent-profile.dto';
import { ReqUpdateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-update-parent-profile.dto';
import { ResCreateParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-create-parent-profile.dto';
import { ResGetParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-get-parent-profile.dto';
import { ResUpdateParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-update-parent-profile.dto';
import { FuncParentProfileService } from '~src/grpc/modules/func-parent-profile/func-parent-profile.service';
import { ValidationUtils } from '~src/utils/validation.utils';

@Controller('FuncParentProfileController')
export class FuncParentProfileController {
    constructor(
        private readonly funcParentProfileService: FuncParentProfileService,
    ) {}

    @GrpcMethod('FuncParentProfileRpcService', 'get')
    @GRPCTrace('FuncParentProfileRpcService.get')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async get(
        getParentProfileDto: ReqGetParentProfileDto,
    ): Promise<ResGetParentProfileDto | null> {
        const dto = await ValidationUtils.validateInput(
            ReqGetParentProfileDto,
            getParentProfileDto,
        );
        return this.funcParentProfileService.get(dto);
    }

    @GrpcMethod('FuncParentProfileRpcService', 'put')
    @GRPCTrace('FuncParentProfileRpcService.put')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async put(
        createParentProfileDto: ReqCreateParentProfileDto,
    ): Promise<ResCreateParentProfileDto | null> {
        const dto = await ValidationUtils.validateInput(
            ReqCreateParentProfileDto,
            createParentProfileDto,
        );
        return this.funcParentProfileService.put(dto);
    }

    @GrpcMethod('FuncParentProfileRpcService', 'update')
    @GRPCTrace('FuncParentProfileRpcService.update')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async update(
        updateParentProfileDto: ReqUpdateParentProfileDto,
    ): Promise<ResUpdateParentProfileDto | null> {
        const dto = await ValidationUtils.validateInput(
            ReqUpdateParentProfileDto,
            updateParentProfileDto,
        );
        return this.funcParentProfileService.update(dto);
    }
}
