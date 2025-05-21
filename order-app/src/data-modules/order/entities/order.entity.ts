import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order' })
export class Order {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'parent_id' })
    parentId: number;

    @Column({ name: 'sitter_id' })
    sitterId: number;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'location' })
    location: string;

    @Column({ name: 'duration_hours' })
    durationHours: number;

    @Column({ name: 'duration_minutes' })
    durationMinutes: number;

    @Column({ name: 'cost' })
    cost: number;

    @Column({ name: 'kids_description' })
    kidsDescription: string;

    @Column({ name: 'date', type: 'timestamptz' })
    date: Date;
}
