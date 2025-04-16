import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'rating' })
export class Rating {
    @PrimaryColumn({ name: 'id' })
    id: number;

    @Column({ name: 'rating' })
    rating: number;

    @Column({ name: 'reviews_amount' })
    reviewsAmount: number;
}
