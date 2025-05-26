import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';

export class ReqGetUserInfoDto {
    @IsEnum(ProfileType, {
        message: `user profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'user profileType is empty' })
    profileType: ProfileType;
}
