import { ResGetRatingDto } from '~src/data-modules/rating/dto/response-dto/res-get-rating.dto';
import { ResGetReviewsForProfileDto } from '~src/data-modules/review/dto/response-dto/res-get-reviews-for-profile.dto';
import { ResGetUserDto } from '~src/data-modules/user/dto/response-dto/res-get-user.dto';

export class ResGetUserInfoDto {
    user: ResGetUserDto;
    profile: {
        id: number;
        ordersAmount: number;
        price?: number;
        location?: string;
    };
    rating: ResGetRatingDto;
    reviews: ResGetReviewsForProfileDto[];
}
