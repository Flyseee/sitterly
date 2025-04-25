import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileType } from '~src/data-modules/reviews/enums/profile-type.enum';

@Entity({ name: 'rating' })
export class Review {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'profile_from_id' })
    profileFromId: number;

    @Column({ name: 'profile_to_id' })
    profileToId: number;

    @Column({ name: 'profile_type' })
    profileToType: ProfileType;

    @Column({ name: 'text' })
    text: string;

    @Column({ name: 'stars' })
    stars: number;
}
