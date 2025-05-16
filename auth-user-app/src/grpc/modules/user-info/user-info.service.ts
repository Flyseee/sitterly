import { status } from '@grpc/grpc-js';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { GrpcStatusCode } from '~src/app/filters/grpc-status-code.enum';
import { ReqCheckJwtDto } from '~src/data-modules/user/dto/request-dto/req-check-jwt.dto';
import { ReqGetUserDto } from '~src/data-modules/user/dto/request-dto/req-get-user.dto';
import { ReqUpdateUserDto } from '~src/data-modules/user/dto/request-dto/req-update-user.dto';
import { ReqUploadAvatarDto } from '~src/data-modules/user/dto/request-dto/req-upload-avatar.dto';
import { ResCheckJwtDto } from '~src/data-modules/user/dto/response-dto/res-check-jwt.dto';
import { ResGetUserDto } from '~src/data-modules/user/dto/response-dto/res-get-user.dto';
import { ResUpdateUserDto } from '~src/data-modules/user/dto/response-dto/res-update-user.dto';
import { ResUploadAvatarDto } from '~src/data-modules/user/dto/response-dto/res-upload-avatar-dto';
import { UserService } from '~src/data-modules/user/user.service';
import { S3Service } from '~src/storage-modules/s3/s3.service';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class UserInfoService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly s3Service: S3Service,
        private readonly logger: Logger,
    ) {}

    @Trace('UserInfoService.getUserInfo', { logInput: true, logOutput: true })
    async getUserById(getUserDto: ReqGetUserDto): Promise<ResGetUserDto> {
        const user = await this.userService.findOne(getUserDto);
        if (!user) {
            throw new RpcException({
                code: GrpcStatusCode.NOT_FOUND,
                message: `user was not found for id: ${getUserDto.id}`,
            });
        }
        const url = await this.s3Service.getPresignedUrl(user.phoneNumber);

        const resUser: ResGetUserDto = { ...user, avatarUrl: url };
        return resUser;
    }

    @Trace('UserInfoService.checkJWT', { logInput: true, logOutput: true })
    async checkJWT(checkJwtDto: ReqCheckJwtDto): Promise<ResCheckJwtDto> {
        let payload: any;
        try {
            payload = this.jwtService.verify(checkJwtDto.token);
        } catch (e) {
            throw new RpcException({
                code: GrpcStatusCode.UNAUTHENTICATED,
                message: 'invalid token',
            });
        }
        const user = await this.userService.findOne(payload.sub);
        if (!user) {
            throw new RpcException({
                code: GrpcStatusCode.NOT_FOUND,
                message: `user was not found for id: ${payload.sub}`,
            });
        }
        const url = await this.s3Service.getPresignedUrl(user.phoneNumber);
        const resCheckJwt: ResCheckJwtDto = { ...user, avatarUrl: url };

        return resCheckJwt;
    }

    @Trace('UserInfoService.updateUserProfile', {
        logInput: true,
        logOutput: true,
    })
    async updateUserProfile(
        reqUpdateUserDto: ReqUpdateUserDto,
    ): Promise<ResUpdateUserDto> {
        const user = await this.userService.findOne({
            id: reqUpdateUserDto.id,
        });
        if (!user) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `user was not found for id: ${reqUpdateUserDto.id}`,
            });
        }
        const url = await this.s3Service.getPresignedUrl(user.phoneNumber);

        const resUser: ResUpdateUserDto = {
            ...(await this.userService.update(reqUpdateUserDto)),
            avatarUrl: url,
        };
        return resUser;
    }

    @Trace('UserInfoService.uploadAvatar', { logInput: true, logOutput: true })
    async uploadAvatar(
        uploadAvatarDto: ReqUploadAvatarDto,
    ): Promise<ResUploadAvatarDto> {
        const user = await this.userService.findOne({ id: uploadAvatarDto.id });
        if (!user) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `user was not found for id: ${uploadAvatarDto.id}`,
            });
        }
        const resUrl: ResUploadAvatarDto = {
            avatarUrl: await this.s3Service.uploadBuffer(
                user.phoneNumber,
                uploadAvatarDto.fileData,
                this.detectMimeType(uploadAvatarDto.filename),
            ),
        };
        return resUrl;
    }

    @Trace('UserInfoService.detectMimeType', {
        logInput: true,
        logOutput: true,
    })
    private detectMimeType(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'png':
                return 'image/png';
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'gif':
                return 'image/gif';
            default:
                return 'application/octet-stream';
        }
    }
}
