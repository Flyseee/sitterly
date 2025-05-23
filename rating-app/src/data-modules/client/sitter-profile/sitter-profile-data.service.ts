import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { ReqGetSitterProfileDto } from '~src/data-modules/client/sitter-profile/dto/request-dto/req-get-sitter-profile.dto';
import { ResGetSitterProfileDto } from '~src/data-modules/client/sitter-profile/dto/response-dto/res-get-sitter-profile.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface FuncSitterProfileRpcService {
    get(
        dto: ReqGetSitterProfileDto,
    ): Observable<GrpcDto<ResGetSitterProfileDto | null>>;
}

@Injectable()
export class SitterProfileDataService implements OnModuleInit {
    private funcSitterProfileRpcService: FuncSitterProfileRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'sitterProfile',
            protoPath: join(
                __dirname,
                '../../../grpc/proto/client/sitter-profile.proto',
            ),
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
        return await lastValueFrom(
            this.funcSitterProfileRpcService.get({ id }),
        );
    }
}
