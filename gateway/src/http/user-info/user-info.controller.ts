import {
    Body,
    Controller,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    OnModuleInit,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { join } from 'path';
import { HTTPTrace } from '~src/app/decorators/http-trace.decorator';
import { HttpExceptionFilter } from '~src/app/filter/error.filter';
import { TracingInterceptor } from '~src/app/interceptors/tracing.interceptor';
import { ReqCheckJwtDto } from '~src/data-modules/user/request-dto/req-check-jwt.dto';
import { ReqGetUserDto } from '~src/data-modules/user/request-dto/req-get-user.dto';
import { ReqUpdateUserDto } from '~src/data-modules/user/request-dto/req-update-user.dto';
import { ReqUploadAvatarDto } from '~src/data-modules/user/request-dto/req-upload-avatar.dto';
import { ResCheckJwtDto } from '~src/data-modules/user/response-dto/res-check-jwt.dto';
import { ResGetUserDto } from '~src/data-modules/user/response-dto/res-get-user.dto';
import { ResUpdateUserDto } from '~src/data-modules/user/response-dto/res-update-user.dto';
import { ResUploadAvatarDto } from '~src/data-modules/user/response-dto/res-upload-avatar-dto';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface UserInfoRpcService {
    GetUserById(getUserDto: ReqGetUserDto): Promise<GrpcDto<ResGetUserDto>>;

    CheckJWT(checkJwtDto: ReqCheckJwtDto): Promise<GrpcDto<ResCheckJwtDto>>;

    UpdateUser(
        updateUserDto: ReqUpdateUserDto,
    ): Promise<GrpcDto<ResUpdateUserDto>>;

    UploadAvatar(
        uploadAvatarDto: ReqUploadAvatarDto,
    ): Promise<GrpcDto<ResUploadAvatarDto>>;
}

@Controller('userInfo')
export class UserInfoController implements OnModuleInit {
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

    @Get('/users/:id')
    @ApiOperation({
        summary: 'Получить пользователя по ID',
        operationId: 'get-by-id',
    })
    @ApiParam({ name: 'id', type: 'number', description: 'ID пользователя' })
    @ApiResponse({
        status: 200,
        description: 'Пользователь найден',
        type: GrpcDto<ResGetUserDto>,
    })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    @HTTPTrace('UserInfo.getById')
    async getById(@Param('id') id: string): Promise<GrpcDto<ResGetUserDto>> {
        try {
            return await this.userInfoRpcService.GetUserById({
                id: +id,
            });
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }

    @Get('check-jwt')
    @ApiOperation({
        summary: 'Проверить JWT и получить профиль',
        operationId: 'user-check-jwt',
    })
    @ApiResponse({
        status: 200,
        description: 'Данные пользователя',
        type: GrpcDto<ResCheckJwtDto>,
    })
    @ApiResponse({ status: 401, description: 'Неверный токен' })
    @ApiBearerAuth('defaultBearerAuth')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    @HTTPTrace('UserInfo.checkJwt')
    async checkJwt(@Headers() headers): Promise<GrpcDto<ResCheckJwtDto>> {
        try {
            if (!headers.authorization) {
                throw new HttpException(
                    'headers.authorization is empty',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const localToken = headers.authorization.split(' ')[1];
            return await this.userInfoRpcService.CheckJWT({
                token: localToken,
            });
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
        }
    }

    @Patch('/users')
    @ApiOperation({
        summary: 'Обновить профиль пользователя',
        operationId: 'update-profile',
    })
    @ApiResponse({
        status: 200,
        description: 'Профиль обновлён',
        type: GrpcDto<ResUpdateUserDto>,
    })
    @ApiBody({
        schema: {
            properties: {
                id: { type: 'number' },
                phone_number: { type: 'string', format: 'phone' },
                password: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                secondName: { type: 'string' },
                birthDate: { type: 'string', format: 'date-time' },
                email: { type: 'string' },
            },
        },
    })
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    @HTTPTrace('UserInfo.updateUser')
    async updateUser(
        @Body() dto: ReqUpdateUserDto,
    ): Promise<GrpcDto<ResUpdateUserDto>> {
        try {
            return await this.userInfoRpcService.UpdateUser(dto);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post('/users/:id/avatar')
    @ApiOperation({
        summary: 'Загрузить аватарку',
        operationId: 'user-upload-avatar',
    })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({
        status: 201,
        description: 'Аватарка загружена',
        type: GrpcDto<ResUploadAvatarDto>,
    })
    @ApiBody({
        description: 'Загрузка файла',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['file'],
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    @HTTPTrace('UserInfo.uploadAvatar')
    async uploadAvatar(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<GrpcDto<ResUploadAvatarDto>> {
        try {
            return await this.userInfoRpcService.UploadAvatar({
                id: +id,
                filename: file.originalname,
                fileData: file.buffer,
            });
        } catch (e) {
            throw new HttpException(
                e.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
