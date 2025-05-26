import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { ReqCreateRatingDto } from '~src/data-modules/rating/dto/request-dto/req-create-rating.dto';
import { ReqGetRatingDto } from '~src/data-modules/rating/dto/request-dto/req-get-rating.dto';
import { ResCreateRatingDto } from '~src/data-modules/rating/dto/response-dto/res-create-rating.dto';
import { ResGetRatingDto } from '~src/data-modules/rating/dto/response-dto/res-get-rating.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface UserRatingRpcService {
    put(dto: ReqCreateRatingDto): Observable<GrpcDto<ResCreateRatingDto>>;

    get(dto: ReqGetRatingDto): Observable<GrpcDto<ResGetRatingDto>>;
}

@Injectable()
export class RatingService implements OnModuleInit {
    private userRatingRpcService: UserRatingRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'rating',
            protoPath: join(__dirname, '../../grpc/proto/rating.proto'),
            url: '89.169.2.227:54055',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.userRatingRpcService =
            this.client.getService<UserRatingRpcService>(
                'UserRatingRpcService',
            );
    }

    @Trace('RatingService.put', {
        logInput: true,
        logOutput: true,
    })
    async put(dto: ReqCreateRatingDto): Promise<GrpcDto<ResCreateRatingDto>> {
        return lastValueFrom(this.userRatingRpcService.put(dto));
    }

    @Trace('RatingService.get', {
        logInput: true,
        logOutput: true,
    })
    async get(dto: ReqGetRatingDto): Promise<GrpcDto<ResGetRatingDto>> {
        return lastValueFrom(this.userRatingRpcService.get(dto));
    }
}
