import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Validator } from 'class-validator';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';
import { ParentProfileDataService } from '~src/data-modules/client/parent-profile/parent-profile-data.service';
import { SitterProfileDataService } from '~src/data-modules/client/sitter-profile/sitter-profile-data.service';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';
import { ReqCreateFullReviewDto } from '~src/data-modules/review/dto/request-dto/req-create-full-review.dto';
import { ReqGetReviewsForProfileDto } from '~src/data-modules/review/dto/request-dto/req-get-reviews-for-profile.dto';
import { ResCreateReviewDto } from '~src/data-modules/review/dto/response-dto/res-create-review.dto';
import { ResGetReviewsForProfileDto } from '~src/data-modules/review/dto/response-dto/res-get-reviews-for-profile.dto';
import { ReviewService } from '~src/data-modules/review/review.service';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class ProfileReviewsService {
    readonly validator = new Validator();

    constructor(
        private readonly reviewService: ReviewService,
        private readonly sitterProfileDataService: SitterProfileDataService,
        private readonly parentProfileDataService: ParentProfileDataService,
    ) {}

    @Trace('ProfileReviewsService.put', { logInput: true, logOutput: true })
    async put(
        createFullReviewDto: ReqCreateFullReviewDto,
    ): Promise<ResCreateReviewDto> {
        let profileTo, profileFrom;
        if (createFullReviewDto.profileToType == ProfileType.SITTER) {
            profileTo = await this.sitterProfileDataService.get(
                createFullReviewDto.profileToId,
            );
            profileFrom = await this.parentProfileDataService.get(
                createFullReviewDto.profileFromId,
            );
        } else if (createFullReviewDto.profileToType == ProfileType.PARENT) {
            profileTo = await this.parentProfileDataService.get(
                createFullReviewDto.profileToId,
            );
            profileFrom = await this.sitterProfileDataService.get(
                createFullReviewDto.profileFromId,
            );
        } else {
            throw new RpcException({
                message: `profileToType = ${createFullReviewDto.profileToType} does not exist`,
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        }
        if (!profileTo || !profileTo.data || profileTo._error) {
            throw new RpcException({
                message:
                    `profileTo with id = ${createFullReviewDto.profileToId} and` +
                    `type = ${createFullReviewDto.profileToType} does not exist`,
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        }
        if (!profileFrom || !profileFrom.data || profileFrom._error) {
            throw new RpcException({
                message: `profileFrom with id = ${createFullReviewDto.profileFromId} does not exist`,
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        }

        const resCreateDto: ResCreateReviewDto =
            await this.reviewService.put(createFullReviewDto);
        return resCreateDto;
    }

    @Trace('ProfileReviewsService.getListForProfile', {
        logInput: true,
        logOutput: true,
    })
    async getListForProfile(
        getReviewsForProfileDto: ReqGetReviewsForProfileDto,
    ) {
        const resGetList: ResGetReviewsForProfileDto[] =
            await this.reviewService.getListForProfile(getReviewsForProfileDto);
        return resGetList;
    }
}
