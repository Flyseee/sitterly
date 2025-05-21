export class ResUpdateOrderDto {
    id: number;
    parentId: number;
    sitterId: number;
    description: string;
    location: string;
    durationHours: number;
    durationMinutes: number;
    cost: number;
    kidsDescription: string;
    date: Date;
}
