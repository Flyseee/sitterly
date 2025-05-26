import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';

export class ReqGetRatingDto {
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
