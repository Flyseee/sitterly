import { ProfileType } from '~src/data-modules/review/enums/profile-type.enum';

export class ResGetUnconsideredResultDto {
    profile_to_id: number;
    profile_to_type: ProfileType;
    avg: string;
    count: string;
}
