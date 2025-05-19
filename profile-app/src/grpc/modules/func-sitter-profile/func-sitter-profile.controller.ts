import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPCTrace } from '~src/app/decorators/grpc-trace.decorator';
import { GrpcExceptionFilter } from '~src/app/filter/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ReqCreateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-create-sitter-profile.dto';
import { ReqGetSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-get-sitter-profile.dto';
import { ReqUpdateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-update-sitter-profile.dto';
import { ResGetSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-get-sitter-profile.dto';
import { ResUpdateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-update-sitter-profile.dto';
import { FuncSitterProfileService } from '~src/grpc/modules/func-sitter-profile/func-sitter-profile.service';
import { ValidationUtils } from '~src/utils/validation.utils';

@Controller('FuncSitterProfileController')
export class FuncSitterProfileController {
    constructor(
        private readonly funcSitterProfileService: FuncSitterProfileService,
    ) {}

    @GrpcMethod('FuncSitterProfileRpcService', 'get')
    @GRPCTrace('FuncSitterProfileRpcService.get')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async get(
        getSitterProfileDto: ReqGetSitterProfileDto,
    ): Promise<ResGetSitterProfileDto | null> {
        const dto = await ValidationUtils.validateInput(
            ReqGetSitterProfileDto,
            getSitterProfileDto,
        );
        return this.funcSitterProfileService.get(dto);
    }

    @GrpcMethod('FuncSitterProfileRpcService', 'put')
    @GRPCTrace('FuncSitterProfileRpcService.put')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async put(
        createSitterProfileDto: ReqCreateSitterProfileDto,
    ): Promise<ResUpdateSitterProfileDto | null> {
        const dto = await ValidationUtils.validateInput(
            ReqCreateSitterProfileDto,
            createSitterProfileDto,
        );
        return this.funcSitterProfileService.put(dto);
    }

    @GrpcMethod('FuncSitterProfileRpcService', 'update')
    @GRPCTrace('FuncSitterProfileRpcService.update')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async update(
        updateSitterProfileDto: ReqUpdateSitterProfileDto,
    ): Promise<ResUpdateSitterProfileDto | null> {
        const dto = await ValidationUtils.validateInput(
            ReqUpdateSitterProfileDto,
            updateSitterProfileDto,
        );
        return this.funcSitterProfileService.update(dto);
    }
}
