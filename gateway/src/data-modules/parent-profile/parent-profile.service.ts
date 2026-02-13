import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { ReqCreateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-create-parent-profile.dto';
import { ReqGetParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-get-parent-profile.dto';
import { ReqUpdateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-update-parent-profile.dto';
import { ResCreateParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-create-parent-profile.dto';
import { ResGetParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-get-parent-profile.dto';
import { ResUpdateParentProfileDto } from '~src/data-modules/parent-profile/dto/response-dto/res-update-parent-profile.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface FuncParentProfileRpcService {
    get(
        dto: ReqGetParentProfileDto,
    ): Observable<GrpcDto<ResGetParentProfileDto | null>>;

    put(
        dto: ReqCreateParentProfileDto,
    ): Observable<GrpcDto<ResCreateParentProfileDto | null>>;

    update(
        dto: ReqUpdateParentProfileDto,
    ): Observable<GrpcDto<ResUpdateParentProfileDto | null>>;
}

@Injectable()
export class ParentProfileService implements OnModuleInit {
    private funcParentProfileRpcService: FuncParentProfileRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'parentProfile',
            protoPath: join(__dirname, '../../grpc/proto/parent-profile.proto'),
            url: 'localhost:50355',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.funcParentProfileRpcService =
            this.client.getService<FuncParentProfileRpcService>(
                'FuncParentProfileRpcService',
            );
    }

    @Trace('ParentProfileService.get', {
        logInput: true,
        logOutput: true,
    })
    async get(id: number): Promise<GrpcDto<ResGetParentProfileDto | null>> {
        return lastValueFrom(this.funcParentProfileRpcService.get({ id }));
    }

    @Trace('ParentProfileService.put', {
        logInput: true,
        logOutput: true,
    })
    async put(
        dto: ReqCreateParentProfileDto,
    ): Promise<GrpcDto<ResCreateParentProfileDto | null>> {
        return lastValueFrom(this.funcParentProfileRpcService.put(dto));
    }

    @Trace('ParentProfileService.update', {
        logInput: true,
        logOutput: true,
    })
    async update(
        dto: ReqUpdateParentProfileDto,
    ): Promise<GrpcDto<ResUpdateParentProfileDto | null>> {
        return lastValueFrom(this.funcParentProfileRpcService.update(dto));
    }
}
