import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';

export class ReqCreateReviewDto {
    @IsInt({ message: 'review profileFromId must be integer' })
    @IsNotEmpty({ message: 'profileFromId is empty' })
    @Min(0)
    profileFromId: number;

    @IsInt({ message: 'review profileToId must be integer' })
    @IsNotEmpty({ message: 'profileToId is empty' })
    @Min(0)
    profileToId: number;

    @IsEnum(ProfileType, {
        message: `profileToType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profileToType is empty' })
    profileToType: ProfileType;

    @IsString({ message: 'review text must be string' })
    text: string;

    @IsInt({ message: 'review stars must be integer' })
    @IsNotEmpty({ message: 'review stars is empty' })
    @Min(0)
    @Max(5)
    stars: number;
}
