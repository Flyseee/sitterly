import { Controller, HttpStatus } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { VersionService } from '~src/data-modules/version/version.service';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';

@Controller()
export class VersionController {
    constructor(private versionService: VersionService) {}

    @GrpcMethod('VersionRpcService', 'getVersion')
    @GRPCTrace('VersionRpcService.getVersion')
    get(): Promise<{ version: number }> {
        return this.versionService.getLastVersion();
    }

    @GrpcMethod('VersionRpcService', 'error')
    @GRPCTrace('VersionRpcService.error')
    error(): Promise<{ version: number }> {
        throw new RpcException({
            message: 'VersionRpcService Error',
            code: GrpcStatusCode.NOT_FOUND,
        });
    }
}
