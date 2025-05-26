import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { ReqCreateReviewDto } from '~src/data-modules/review/dto/request-dto/req-create-review.dto';
import { ReqGetReviewsForProfileDto } from '~src/data-modules/review/dto/request-dto/req-get-reviews-for-profile.dto';
import { ResCreateReviewDto } from '~src/data-modules/review/dto/response-dto/res-create-review.dto';
import { ResGetReviewsForProfileDto } from '~src/data-modules/review/dto/response-dto/res-get-reviews-for-profile.dto';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

class GrpcDto<T> {
    data: T;
    _error: any;
}

interface ProfileReviewsRpcService {
    put(dto: ReqCreateReviewDto): Observable<GrpcDto<ResCreateReviewDto>>;

    getListForProfile(
        dto: ReqGetReviewsForProfileDto,
    ): Observable<GrpcDto<ResGetReviewsForProfileDto[]>>;
}

@Injectable()
export class ReviewService implements OnModuleInit {
    private profileReviewsRpcService: ProfileReviewsRpcService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'review',
            protoPath: join(__dirname, '../../grpc/proto/review.proto'),
            url: '89.169.2.227:54055',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.profileReviewsRpcService =
            this.client.getService<ProfileReviewsRpcService>(
                'ProfileReviewsRpcService',
            );
    }

    @Trace('ReviewService.put', {
        logInput: true,
        logOutput: true,
    })
    async put(dto: ReqCreateReviewDto): Promise<GrpcDto<ResCreateReviewDto>> {
        return lastValueFrom(this.profileReviewsRpcService.put(dto));
    }

    @Trace('ReviewService.getListForProfile', {
        logInput: true,
        logOutput: true,
    })
    async getListForProfile(
        dto: ReqGetReviewsForProfileDto,
    ): Promise<GrpcDto<ResGetReviewsForProfileDto[]>> {
        return lastValueFrom(
            this.profileReviewsRpcService.getListForProfile(dto),
        );
    }
}
