import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'application' })
export class Application {
    @PrimaryColumn({ name: 'id' })
    id: number;

    @Column({ name: 'order_id' })
    orderId: number;

    @Column({ name: 'sitter_id' })
    sitterId: number;

    @Column({ name: 'is_actual' })
    isActual: boolean;
}
