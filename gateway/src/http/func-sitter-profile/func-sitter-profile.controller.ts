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
import { ReqCreateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-create-sitter-profile.dto';
import { ReqGetSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-get-sitter-profile.dto';
import { ReqUpdateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-update-sitter-profile.dto';
import { ResCreateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-create-sitter-profile.dto';
import { ResGetSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-get-sitter-profile.dto';
import { ResUpdateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-update-sitter-profile.dto';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface FuncSitterProfileRpcService {
    get(
        dto: ReqGetSitterProfileDto,
    ): Promise<GrpcDto<ResGetSitterProfileDto | null>>;

    put(
        dto: ReqCreateSitterProfileDto,
    ): Promise<GrpcDto<ResCreateSitterProfileDto | null>>;

    update(
        dto: ReqUpdateSitterProfileDto,
    ): Promise<GrpcDto<ResUpdateSitterProfileDto | null>>;
}

@Controller('FuncSitterProfileController')
export class FuncSitterProfileController implements OnModuleInit {
    private funcSitterProfileRpcService: FuncSitterProfileRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'sitterProfile',
            protoPath: join(__dirname, '../../grpc/proto/sitter-profile.proto'),
            url: 'localhost:50355',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.funcSitterProfileRpcService =
            this.client.getService<FuncSitterProfileRpcService>(
                'FuncSitterProfileRpcService',
            );
    }

    @Get('/sitterProfile/:id')
    @ApiOperation({
        summary: 'Получить профиль ситтера',
        operationId: 'get-sitter-profile',
    })
    @ApiParam({ name: 'id', type: 'number', description: 'ID профиля ситтера' })
    @ApiResponse({
        status: 200,
        description: 'Профиль найден',
        type: GrpcDto<ResGetSitterProfileDto | null>,
    })
    @HTTPTrace('FuncSitterProfileRpcService.get')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async get(
        @Param('id') id: string,
    ): Promise<GrpcDto<ResGetSitterProfileDto | null>> {
        return this.funcSitterProfileRpcService.get({ id: +id });
    }

    @Put('/sitterProfile')
    @ApiOperation({
        summary: 'Создать профиль ситтера',
        operationId: 'create-sitter-profile',
    })
    @ApiResponse({
        status: 200,
        description: 'Профиль ситтера создан',
        type: GrpcDto<ResCreateSitterProfileDto | null>,
    })
    @ApiBody({
        schema: {
            properties: {
                ordersAmount: { type: 'number' },
                price: { type: 'number' },
                location: { type: 'string' },
            },
        },
    })
    @HTTPTrace('FuncSitterProfileRpcService.put')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async put(
        @Body() dto: ReqCreateSitterProfileDto,
    ): Promise<GrpcDto<ResCreateSitterProfileDto | null>> {
        return this.funcSitterProfileRpcService.put(dto);
    }

    @Patch('/sitterProfile')
    @ApiOperation({
        summary: 'Обновить профиль ситтера',
        operationId: 'update-sitter-profile',
    })
    @ApiResponse({
        status: 200,
        description: 'Профиль ситтера обновлен',
        type: GrpcDto<ResUpdateSitterProfileDto | null>,
    })
    @ApiBody({
        schema: {
            properties: {
                id: { type: 'number' },
                ordersAmount: { type: 'number' },
                price: { type: 'number' },
                location: { type: 'string' },
            },
        },
    })
    @HTTPTrace('FuncSitterProfileRpcService.update')
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(TracingInterceptor)
    async update(
        @Body() dto: ReqUpdateSitterProfileDto,
    ): Promise<GrpcDto<ResUpdateSitterProfileDto | null>> {
        return this.funcSitterProfileRpcService.update(dto);
    }
}
