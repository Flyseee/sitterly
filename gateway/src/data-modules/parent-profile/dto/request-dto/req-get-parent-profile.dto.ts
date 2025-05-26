import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReqGetParentProfileDto {
    @IsInt({ message: 'parentProfile id must be integer' })
    @IsNotEmpty({ message: 'parentProfile id is empty' })
    @Min(0)
    id: number;
}
