import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';
import { ReqCreateRatingDto } from '~src/data-modules/rating/dto/request-dto/req-create-rating.dto';

export class ReqUpdateRatingDto extends PartialType(ReqCreateRatingDto) {
    @IsInt({ message: 'rating profileId must be integer' })
    @IsNotEmpty({ message: 'profileId is empty' })
    @Min(0)
    profileId: number;

    @IsEnum(ProfileType, {
        message: `profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profileType is empty' })
    profileType: ProfileType;
}
