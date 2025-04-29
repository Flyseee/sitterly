import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';
import { ProfileType } from '~src/data-modules/review/enums/profile-type.enum';

@Entity()
export class UpdateReviewDto {
    @IsInt({ message: 'review profileToId must be integer' })
    @IsNotEmpty({ message: 'profile_to_id is empty' })
    @Min(0)
    profileToId: number;

    @IsEnum(ProfileType, {
        message: `profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profile_type is empty' })
    profileToType: ProfileType;
}
