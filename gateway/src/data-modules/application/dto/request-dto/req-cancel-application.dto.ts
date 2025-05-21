import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReqCancelApplicationDto {
    @IsInt({ message: 'application id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    @Min(0)
    id: number;
}
