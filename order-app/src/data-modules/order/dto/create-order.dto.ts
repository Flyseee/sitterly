import { IsEnum, IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Entity } from 'typeorm';
import { ProfileType } from '~src/data-modules/review/enums/profile-type.enum';

@Entity()
export class CreateRatingDto {
    @IsInt({ message: 'rating profileId must be integer' })
    @IsNotEmpty({ message: 'profileId is empty' })
    @Min(0)
    profileId: number;

    @IsEnum(ProfileType, {
        message: `profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profileType is empty' })
    profileType: ProfileType;

    @IsNumber(
        { allowNaN: false, allowInfinity: false },
        { message: 'rating rating must be number' },
    )
    @IsNotEmpty({ message: 'rating is empty' })
    @Min(0)
    @Max(5)
    rating: number;

    @IsInt({ message: 'rating reviewsAmount must be integer' })
    @IsNotEmpty({ message: 'reviews amount is empty' })
    @Min(0)
    reviewsAmount: number;
}
