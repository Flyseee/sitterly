import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';
import { CreateRatingDto } from '~src/data-modules/rating/dto/createRating.dto';
import { ProfileType } from '~src/data-modules/reviews/enums/profile-type.enum';

@Entity()
export class UpdateRatingDto extends PartialType(CreateRatingDto) {
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
