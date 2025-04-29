import { IsEnum, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { Entity } from 'typeorm';
import { ProfileType } from '~src/data-modules/review/enums/profile-type.enum';

@Entity()
export class CalcRatingDto {
    @IsInt({ message: 'rating profileId must be integer' })
    @IsNotEmpty({ message: 'profileId is empty' })
    @Min(0)
    profileId: number;

    @IsEnum(ProfileType, {
        message: `profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profileType is empty' })
    profileType: ProfileType;

    @IsInt({ message: 'rating calcDto stars must be integer' })
    @IsNotEmpty({ message: 'rating stars are empty' })
    @Min(0)
    @Max(5)
    stars: number;
}
