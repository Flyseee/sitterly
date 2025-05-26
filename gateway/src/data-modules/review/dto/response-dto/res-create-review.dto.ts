import { ProfileType } from '~src/data-modules/enums/profile-type.enum';

export class ResCreateReviewDto {
    id: number;
    profileFromId: number;
    profileToId: number;
    profileToType: ProfileType;
    text: string;
    stars: number;
    date: string;
    isConsidered: boolean;
}
