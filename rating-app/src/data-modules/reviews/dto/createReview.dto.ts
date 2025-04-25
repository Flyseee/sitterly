import { Entity } from 'typeorm';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ProfileType } from '~src/data-modules/reviews/enums/profile-type.enum';

@Entity()
export class CreateReviewDto {
    @IsInt({ message: 'review id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;

    @IsInt({ message: 'review profileFromId must be integer' })
    @IsNotEmpty({ message: 'profile_from_id is empty' })
    @Min(0)
    profileFromId: number;

    @IsInt({ message: 'review profileToId must be integer' })
    @IsNotEmpty({ message: 'profile_to_id is empty' })
    @Min(0)
    profileToId: number;

    @IsEnum(ProfileType, {
        message: `profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profile_type is empty' })
    profileToType: ProfileType;

    @IsString({ message: 'review text must be a string' })
    text: string;

    @IsInt({ message: 'review stars must be integer' })
    @IsNotEmpty({ message: 'review stars is empty' })
    @Min(0)
    @Max(5)
    stars: number;
}
