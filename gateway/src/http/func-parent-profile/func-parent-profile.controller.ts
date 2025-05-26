import {
    Body,
    Controller,
    Get,
    OnModuleInit,
    Param,
    Patch,
    Put,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { join } from 'path';
import { HTTPTrace } from '~src/app/decorators/http-trace.decorator';
import { HttpExceptionFilter } from '~src/app/filter/error.filter';
import { TracingInterceptor } from '~src/app/interceptors/tracing.interceptor';
import { ReqCreateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-create-parent-profile.dto';
import { ReqGetParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-get-parent-profile.dto';
import { ReqUpdateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-update-parent-profile.dto';
import { ResCreateParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-create-parent-profile.dto';
import { ResGetParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-get-parent-profile.dto';
import { ResUpdateParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-update-parent-profile.dto';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface FuncParentProfileRpcService {
    get(
        dto: ReqGetParentProfileDto,
    ): Promise<GrpcDto<ResGetParentProfileDto | null>>;

    put(
        dto: ReqCreateParentProfileDto,
    ): Promise<GrpcDto<ResCreateParentProfileDto | null>>;

    update(
        dto: ReqUpdateParentProfileDto,
    ): Promise<GrpcDto<ResUpdateParentProfileDto | null>>;
}

@Controller('FuncParentProfileController')
export class FuncParentProfileController implements OnModuleInit {
    private funcParentProfileRpcService: FuncParentProfileRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'parentProfile',
            protoPath: join(__dirname, '../../grpc/proto/parent-profile.proto'),
            url: '89.169.2.227:53055',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.funcParentProfileRpcService =
            this.client.getService<FuncParentProfileRpcService>(
                'FuncParentProfileRpcService',
            );
    }

    @Get('/parentProfile/:id')
    @ApiOperation({
        summary: 'Получить профиль родителя',
        operationId: 'get-parent-profile',
    })
    @ApiParam({
        name: 'id',
        type: 'number',
        description: 'ID профиля родителя',
    })
    @ApiResponse({
        status: 200,
        description: 'Профиль найден',
        type: GrpcDto<ResGetParentProfileDto | null>,
    })
    @HTTPTrace('FuncParentProfileRpcService.get')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async get(
        @Param('id') id: string,
    ): Promise<GrpcDto<ResGetParentProfileDto | null>> {
        return this.funcParentProfileRpcService.get({ id: +id });
    }

    @Put('/parentProfile')
    @ApiOperation({
        summary: 'Создать профиль родителя',
        operationId: 'create-parent-profile',
    })
    @ApiResponse({
        status: 200,
        description: 'Профиль родителя создан',
        type: GrpcDto<ResCreateParentProfileDto | null>,
    })
    @ApiBody({
        schema: {
            properties: {
                ordersAmount: { type: 'number' },
            },
        },
    })
    @HTTPTrace('FuncParentProfileRpcService.put')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async put(
        @Body() dto: ReqCreateParentProfileDto,
    ): Promise<GrpcDto<ResCreateParentProfileDto | null>> {
        return this.funcParentProfileRpcService.put(dto);
    }

    @Patch('/parentProfile')
    @ApiOperation({
        summary: 'Обновить профиль родителя',
        operationId: 'update-parent-profile',
    })
    @ApiResponse({
        status: 200,
        description: 'Профиль родителя обновлен',
        type: GrpcDto<ResUpdateParentProfileDto | null>,
    })
    @ApiBody({
        schema: {
            properties: {
                id: { type: 'number' },
                ordersAmount: { type: 'number' },
            },
        },
    })
    @HTTPTrace('FuncParentProfileRpcService.update')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async update(
        @Body() dto: ReqUpdateParentProfileDto,
    ): Promise<GrpcDto<ResUpdateParentProfileDto | null>> {
        return this.funcParentProfileRpcService.update(dto);
    }
}
