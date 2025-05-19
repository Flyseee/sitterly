import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sitter_profile' })
export class SitterProfile {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'orders_amount' })
    ordersAmount: number;

    @Column({ name: 'price' })
    price: number;

    @Column({ name: 'location' })
    location: string;
}
