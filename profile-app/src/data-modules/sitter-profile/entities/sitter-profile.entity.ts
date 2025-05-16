import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'sitter_profile' })
export class SitterProfile {
    @PrimaryColumn({ name: 'id' })
    id: number;

    @Column({ name: 'ordersAmount' })
    ordersAmount: number;

    @Column({ name: 'price' })
    price: number;

    @Column({ name: 'location' })
    location: string;
}
