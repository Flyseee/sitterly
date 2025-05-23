import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ReqCreateSitterProfileDto } from '~src/data-modules/client/sitter-profile/dto/request-dto/req-create-sitter-profile.dto';
import { ReqGetSitterProfileDto } from '~src/data-modules/client/sitter-profile/dto/request-dto/req-get-sitter-profile.dto';
import { ReqUpdateSitterProfileDto } from '~src/data-modules/client/sitter-profile/dto/request-dto/req-update-sitter-profile.dto';
import { ResCreateSitterProfileDto } from '~src/data-modules/client/sitter-profile/dto/response-dto/res-create-sitter-profile.dto';
import { ResGetSitterProfileDto } from '~src/data-modules/client/sitter-profile/dto/response-dto/res-get-sitter-profile.dto';
import { ResUpdateSitterProfileDto } from '~src/data-modules/client/sitter-profile/dto/response-dto/res-update-sitter-profile.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

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

@Injectable()
export class SitterProfileDataService implements OnModuleInit {
    private funcSitterProfileRpcService: FuncSitterProfileRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'sitterProfile',
            protoPath: join(__dirname, '../../grpc/proto/sitter-profile.proto'),
            url: '89.169.2.227:53055',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.funcSitterProfileRpcService =
            this.client.getService<FuncSitterProfileRpcService>(
                'FuncSitterProfileRpcService',
            );
    }

    @Trace('SitterProfileDataService.get', {
        logInput: true,
        logOutput: true,
    })
    async get(id: number): Promise<GrpcDto<ResGetSitterProfileDto | null>> {
        return this.funcSitterProfileRpcService.get({ id });
    }
}
