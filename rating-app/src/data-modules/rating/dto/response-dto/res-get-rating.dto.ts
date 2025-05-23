import { ProfileType } from '~src/data-modules/enums/profile-type.enum';

export class ResGetRatingDto {
    profileId: number;
    profileType: ProfileType;
    rating: number;
    reviewsAmount: number;
}
