import {
    Controller,
    Logger,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPCTrace } from '~src/app/decorators/grpc-trace.decorator';
import { GrpcExceptionFilter } from '~src/app/filters/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ReqCheckJwtDto } from '~src/data-modules/user/dto/request-dto/req-check-jwt.dto';
import { ReqGetByProfileDto } from '~src/data-modules/user/dto/request-dto/req-get-by-profile.dto';
import { ReqGetUserDto } from '~src/data-modules/user/dto/request-dto/req-get-user.dto';
import { ReqUpdateUserDto } from '~src/data-modules/user/dto/request-dto/req-update-user.dto';
import { ReqUploadAvatarDto } from '~src/data-modules/user/dto/request-dto/req-upload-avatar.dto';
import { ResCheckJwtDto } from '~src/data-modules/user/dto/response-dto/res-check-jwt.dto';
import { ResGetByProfileDto } from '~src/data-modules/user/dto/response-dto/res-get-by-profile.dto';
import { ResGetUserDto } from '~src/data-modules/user/dto/response-dto/res-get-user.dto';
import { ResUpdateUserDto } from '~src/data-modules/user/dto/response-dto/res-update-user.dto';
import { ResUploadAvatarDto } from '~src/data-modules/user/dto/response-dto/res-upload-avatar-dto';
import { UserInfoService } from '~src/grpc/modules/user-info/user-info.service';
import { ValidationUtils } from '~src/utils/validation.utils';

@Controller()
export class UserInfoController {
    constructor(
        private readonly userInfoService: UserInfoService,
        private readonly logger: Logger,
    ) {}

    @GrpcMethod('UserInfoRpcService', 'GetUserById')
    @GRPCTrace('UserInfoRpcService.getUserById')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getUserById(getUserDto: ReqGetUserDto): Promise<ResGetUserDto> {
        const dto = await ValidationUtils.validateInput(
            ReqGetUserDto,
            getUserDto,
        );
        return await this.userInfoService.getUserById(dto);
    }

    @GrpcMethod('UserInfoRpcService', 'CheckJWT')
    @GRPCTrace('UserInfoRpcService.checkJWT')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async checkJWT(checkJwtDto: ReqCheckJwtDto): Promise<ResCheckJwtDto> {
        const dto = await ValidationUtils.validateInput(
            ReqCheckJwtDto,
            checkJwtDto,
        );
        return await this.userInfoService.checkJWT(dto);
    }

    @GrpcMethod('UserInfoRpcService', 'UpdateUser')
    @GRPCTrace('UserInfoRpcService.updateUser')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async updateUser(
        updateUserDto: ReqUpdateUserDto,
    ): Promise<ResUpdateUserDto> {
        const dto = await ValidationUtils.validateInput(
            ReqUpdateUserDto,
            updateUserDto,
        );
        return await this.userInfoService.updateUser(dto);
    }

    @GrpcMethod('UserInfoRpcService', 'UploadAvatar')
    @GRPCTrace('UserInfoRpcService.uploadAvatar')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async uploadAvatar(
        uploadAvatarDto: ReqUploadAvatarDto,
    ): Promise<ResUploadAvatarDto> {
        const dto = await ValidationUtils.validateInput(
            ReqUploadAvatarDto,
            uploadAvatarDto,
        );
        return await this.userInfoService.uploadAvatar(dto);
    }

    @GrpcMethod('UserInfoRpcService', 'GetByProfile')
    @GRPCTrace('UserInfoRpcService.getByProfile')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getByProfile(
        getByProfileDto: ReqGetByProfileDto,
    ): Promise<ResGetByProfileDto | undefined | null> {
        this.logger.log('user controller ' + getByProfileDto.profileType);
        const dto = await ValidationUtils.validateInput(
            ReqGetByProfileDto,
            getByProfileDto,
        );

        return await this.userInfoService.getByProfile(getByProfileDto);
    }
}
