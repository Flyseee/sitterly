import { Column, Entity } from 'typeorm';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { ProfileType } from '~src/data-modules/reviews/enums/profile-type.enum';

@Entity()
export class GetReviewDto {
    @IsInt({ message: 'review profileToId must be an integer' })
    @IsNotEmpty({ message: 'profile_to_id is empty' })
    @Min(0)
    profileToId: number;
}
