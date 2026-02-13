import { Controller, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { ReqCreateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-create-sitter-profile.dto';
import { ReqGetSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-get-sitter-profile.dto';
import { ReqUpdateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-update-sitter-profile.dto';
import { ResCreateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-create-sitter-profile.dto';
import { ResGetSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-get-sitter-profile.dto';
import { ResUpdateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/response-dto/res-update-sitter-profile.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface FuncSitterProfileRpcService {
    get(
        dto: ReqGetSitterProfileDto,
    ): Observable<GrpcDto<ResGetSitterProfileDto | null>>;

    put(
        dto: ReqCreateSitterProfileDto,
    ): Observable<GrpcDto<ResCreateSitterProfileDto | null>>;

    update(
        dto: ReqUpdateSitterProfileDto,
    ): Observable<GrpcDto<ResUpdateSitterProfileDto | null>>;
}

@Controller('FuncSitterProfileController')
export class SitterProfileService implements OnModuleInit {
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

    @Trace('SitterProfileService.get', {
        logInput: true,
        logOutput: true,
    })
    async get(id: number): Promise<GrpcDto<ResGetSitterProfileDto | null>> {
        return lastValueFrom(this.funcSitterProfileRpcService.get({ id }));
    }

    @Trace('SitterProfileService.put', {
        logInput: true,
        logOutput: true,
    })
    async put(
        dto: ReqCreateSitterProfileDto,
    ): Promise<GrpcDto<ResCreateSitterProfileDto | null>> {
        return lastValueFrom(this.funcSitterProfileRpcService.put(dto));
    }

    @Trace('SitterProfileService.update', {
        logInput: true,
        logOutput: true,
    })
    async update(
        dto: ReqUpdateSitterProfileDto,
    ): Promise<GrpcDto<ResUpdateSitterProfileDto | null>> {
        return lastValueFrom(this.funcSitterProfileRpcService.update(dto));
    }
}
