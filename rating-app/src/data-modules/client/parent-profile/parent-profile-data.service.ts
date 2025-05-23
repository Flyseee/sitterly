import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ReqCreateParentProfileDto } from '~src/data-modules/client/parent-profile/dto/request-dto/req-create-parent-profile.dto';
import { ReqGetParentProfileDto } from '~src/data-modules/client/parent-profile/dto/request-dto/req-get-parent-profile.dto';
import { ReqUpdateParentProfileDto } from '~src/data-modules/client/parent-profile/dto/request-dto/req-update-parent-profile.dto';
import { ResCreateParentProfileDto } from '~src/data-modules/client/parent-profile/dto/response-dto/res-create-parent-profile.dto';
import { ResGetParentProfileDto } from '~src/data-modules/client/parent-profile/dto/response-dto/res-get-parent-profile.dto';
import { ResUpdateParentProfileDto } from '~src/data-modules/client/parent-profile/dto/response-dto/res-update-parent-profile.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

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

@Injectable()
export class ParentProfileDataService implements OnModuleInit {
    private funcParentProfileRpcService: FuncParentProfileRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'parentProfile',
            protoPath: join(
                __dirname,
                '../../../grpc/proto/client/parent-profile.proto',
            ),
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

    @Trace('ParentProfileDataService.get', {
        logInput: true,
        logOutput: true,
    })
    async get(id: number): Promise<GrpcDto<ResGetParentProfileDto | null>> {
        return this.funcParentProfileRpcService.get({ id });
    }
}
