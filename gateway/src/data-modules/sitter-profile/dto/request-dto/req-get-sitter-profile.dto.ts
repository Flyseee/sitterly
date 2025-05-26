import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReqGetSitterProfileDto {
    @IsInt({ message: 'sitterProfile id must be integer' })
    @IsNotEmpty({ message: 'sitterProfile id is empty' })
    @Min(0)
    id: number;
}
