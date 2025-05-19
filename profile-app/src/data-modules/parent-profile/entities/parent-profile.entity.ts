import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parent_profile' })
export class ParentProfile {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'orders_amount' })
    ordersAmount: number;
}
