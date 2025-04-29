import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';
import { ProfileType } from '~src/data-modules/review/enums/profile-type.enum';

@Entity()
export class GetReviewForProfileDto {
    @IsInt({ message: 'review profileToId must be an integer' })
    @IsNotEmpty({ message: 'profileToId is empty' })
    @Min(0)
    profileToId: number;

    @IsEnum(ProfileType, {
        message: `profileToType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profileToType is empty' })
    profileToType: ProfileType;
}
