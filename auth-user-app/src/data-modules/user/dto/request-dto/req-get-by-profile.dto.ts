import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';

export class ReqGetByProfileDto {
    @IsInt({ message: 'user profileId must be integer' })
    @IsNotEmpty({ message: 'user profileId is empty' })
    profileId: number;

    @IsEnum(ProfileType, {
        message: `profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profileType is empty' })
    profileType: ProfileType;
}
