import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPCTrace } from '~src/app/decorators/grpc-trace.decorator';
import { GrpcExceptionFilter } from '~src/app/filters/grpc-exception.filter';
import { GrpcResultWrapperInterceptor } from '~src/app/interceptors/grpc-result-wrapper.interceptor';
import { ReqCheckJwtDto } from '~src/data-modules/user/dto/request-dto/req-check-jwt.dto';
import { ReqGetUserDto } from '~src/data-modules/user/dto/request-dto/req-get-user.dto';
import { ReqUpdateUserDto } from '~src/data-modules/user/dto/request-dto/req-update-user.dto';
import { ReqUploadAvatarDto } from '~src/data-modules/user/dto/request-dto/req-upload-avatar.dto';
import { ResCheckJwtDto } from '~src/data-modules/user/dto/response-dto/res-check-jwt.dto';
import { ResGetUserDto } from '~src/data-modules/user/dto/response-dto/res-get-user.dto';
import { ResUpdateUserDto } from '~src/data-modules/user/dto/response-dto/res-update-user.dto';
import { ResUploadAvatarDto } from '~src/data-modules/user/dto/response-dto/res-upload-avatar-dto';
import { UserInfoService } from '~src/grpc/modules/user-info/user-info.service';
import { ValidationUtils } from '~src/utils/validation.utils';

@Controller()
export class UserInfoController {
    constructor(private readonly userInfoService: UserInfoService) {}

    @GrpcMethod('UserInfoService', 'GetUserById')
    @GRPCTrace('UserInfoService.getUserById')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async getUserById(getUserDto: ReqGetUserDto): Promise<ResGetUserDto> {
        const dto = await ValidationUtils.validateInput(
            ReqGetUserDto,
            getUserDto,
        );
        return await this.userInfoService.getUserById(dto);
    }

    @GrpcMethod('UserInfoService', 'CheckJWT')
    @GRPCTrace('UserInfoService.checkJWT')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async checkJWT(checkJwtDto: ReqCheckJwtDto): Promise<ResCheckJwtDto> {
        const dto = await ValidationUtils.validateInput(
            ReqCheckJwtDto,
            checkJwtDto,
        );
        return await this.userInfoService.checkJWT(dto);
    }

    @GrpcMethod('UserInfoService', 'UpdateUserProfile')
    @GRPCTrace('UserInfoService.updateUserProfile')
    @UseFilters(GrpcExceptionFilter)
    @UseInterceptors(GrpcResultWrapperInterceptor)
    async updateUserProfile(
        updateUserDto: ReqUpdateUserDto,
    ): Promise<ResUpdateUserDto> {
        const dto = await ValidationUtils.validateInput(
            ReqUpdateUserDto,
            updateUserDto,
        );
        return await this.userInfoService.updateUserProfile(dto);
    }

    @GrpcMethod('UserInfoService', 'UploadAvatar')
    @GRPCTrace('UserInfoService.uploadAvatar')
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
}
