import { ProfileType } from '~src/data-modules/review/enums/profile-type.enum';

export class ResGetReviewsForProfileDto {
    id: number;
    profileFromId: number;
    profileToId: number;
    profileToType: ProfileType;
    text: string;
    stars: number;
    date: string;
    isConsidered: boolean;
}
