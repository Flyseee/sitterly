import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProfileType } from '~src/data-modules/reviews/enums/profile-type.enum';

@Entity({ name: 'rating' })
export class Rating {
    @PrimaryColumn({ name: 'profile_id' })
    profileId: number;

    @PrimaryColumn({ name: 'profile_type' })
    profileType: ProfileType;

    @Column({ name: 'rating' })
    rating: number;

    @Column({ name: 'reviews_amount' })
    reviewsAmount: number;
}
