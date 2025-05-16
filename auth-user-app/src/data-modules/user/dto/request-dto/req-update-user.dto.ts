import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ReqCreateUserDto } from './req-create-user.dto';

export class ReqUpdateUserDto extends PartialType(ReqCreateUserDto) {
    @IsInt({ message: 'user id must be integer' })
    @IsNotEmpty({ message: 'user id is empty' })
    id: number;
}
