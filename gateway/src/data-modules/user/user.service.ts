import {
    Controller,
    HttpException,
    HttpStatus,
    OnModuleInit,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
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
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface UserInfoRpcService {
    GetUserById(getUserDto: ReqGetUserDto): Observable<GrpcDto<ResGetUserDto>>;

    CheckJWT(checkJwtDto: ReqCheckJwtDto): Observable<GrpcDto<ResCheckJwtDto>>;

    UpdateUser(
        updateUserDto: ReqUpdateUserDto,
    ): Observable<GrpcDto<ResUpdateUserDto>>;

    UploadAvatar(
        uploadAvatarDto: ReqUploadAvatarDto,
    ): Observable<GrpcDto<ResUploadAvatarDto>>;

    getByProfile(
        getByProfileDto: ReqGetByProfileDto,
    ): Observable<GrpcDto<ResGetByProfileDto | undefined | null>>;
}

@Controller('userInfo')
export class UserService implements OnModuleInit {
    private userInfoRpcService: UserInfoRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'userInfo',
            protoPath: join(__dirname, '../../grpc/proto/user-info.proto'),
            url: '89.169.2.227:51055',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.userInfoRpcService =
            this.client.getService<UserInfoRpcService>('UserInfoRpcService');
    }

    @Trace('UserService.getById', {
        logInput: true,
        logOutput: true,
    })
    async getById(id: number): Promise<GrpcDto<ResGetUserDto>> {
        try {
            return lastValueFrom(
                this.userInfoRpcService.GetUserById({
                    id,
                }),
            );
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }

    @Trace('UserService.checkJwt', {
        logInput: true,
        logOutput: true,
    })
    async checkJwt(headers): Promise<GrpcDto<ResCheckJwtDto>> {
        try {
            if (!headers.authorization) {
                throw new HttpException(
                    'headers.authorization is empty',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const localToken = headers.authorization.split(' ')[1];
            return lastValueFrom(
                this.userInfoRpcService.CheckJWT({
                    token: localToken,
                }),
            );
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
        }
    }

    @Trace('UserService.updateUser', {
        logInput: true,
        logOutput: true,
    })
    async updateUser(
        dto: ReqUpdateUserDto,
    ): Promise<GrpcDto<ResUpdateUserDto>> {
        try {
            return lastValueFrom(this.userInfoRpcService.UpdateUser(dto));
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }

    @Trace('UserService.uploadAvatar', {
        logInput: true,
        logOutput: true,
    })
    async uploadAvatar(
        id: number,
        file: Express.Multer.File,
    ): Promise<GrpcDto<ResUploadAvatarDto>> {
        try {
            return lastValueFrom(
                this.userInfoRpcService.UploadAvatar({
                    id,
                    filename: file.originalname,
                    fileData: file.buffer,
                }),
            );
        } catch (e) {
            throw new HttpException(
                e.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Trace('UserService.getByProfileDto', {
        logInput: true,
        logOutput: true,
    })
    async getByProfile(
        getByProfileDto: ReqGetByProfileDto,
    ): Promise<GrpcDto<ResGetByProfileDto | undefined | null>> {
        try {
            return lastValueFrom(
                this.userInfoRpcService.getByProfile(getByProfileDto),
            );
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }
}
