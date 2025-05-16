import { IsInt, IsNotEmpty } from 'class-validator';

export class ReqGetUserDto {
    @IsInt({ message: 'user id must be integer' })
    @IsNotEmpty({ message: 'user id is empty' })
    id: number;
}
