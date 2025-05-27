import {
    Body,
    Controller,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { HTTPTrace } from '~src/app/decorators/http-trace.decorator';
import { HttpExceptionFilter } from '~src/app/filter/error.filter';
import { TracingInterceptor } from '~src/app/interceptors/tracing.interceptor';
import { ReqUpdateUserDto } from '~src/data-modules/user/dto/request-dto/req-update-user.dto';
import { ResCheckJwtDto } from '~src/data-modules/user/dto/response-dto/res-check-jwt.dto';
import { ResGetUserDto } from '~src/data-modules/user/dto/response-dto/res-get-user.dto';
import { ResUpdateUserDto } from '~src/data-modules/user/dto/response-dto/res-update-user.dto';
import { ResUploadAvatarDto } from '~src/data-modules/user/dto/response-dto/res-upload-avatar-dto';
import { UserService } from '~src/data-modules/user/user.service';

class GrpcDto<T> {
    data: T;
    _error: any;
}

@Controller('userInfo')
export class UserInfoController {
    private userService: UserService;

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
            return await this.userService.getById(+id);
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
            return await this.userService.checkJwt({
                headers,
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
            return await this.userService.updateUser(dto);
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
            return await this.userService.uploadAvatar(+id, file);
        } catch (e) {
            throw new HttpException(
                e.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
