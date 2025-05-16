import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'parent_profile' })
export class ParentProfile {
    @PrimaryColumn({ name: 'id' })
    id: number;

    @Column({ name: 'ordersAmount' })
    ordersAmount: number;
}
