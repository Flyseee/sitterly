import { Entity } from 'typeorm';
import { IsEnum, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { ProfileType } from '~src/data-modules/reviews/enums/profile-type.enum';

@Entity()
export class GetRatingDto {
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
