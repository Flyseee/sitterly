import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';
import { ProfileType } from '~src/data-modules/review/enums/profile-type.enum';

@Entity()
export class GetUnconsideredResultDto {
    @IsInt({ message: 'review profileToId must be integer' })
    @IsNotEmpty({ message: 'profile_to_id is empty' })
    @Min(0)
    profile_to_id: number;

    @IsEnum(ProfileType, {
        message: `profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profile_type is empty' })
    profile_to_type: ProfileType;

    @IsNotEmpty({ message: 'review avg is empty' })
    avg: string;

    @IsNotEmpty({ message: 'review count is empty' })
    count: string;
}
