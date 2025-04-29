import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class CancelApplicationDto {
    @IsInt({ message: 'application id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;
}
