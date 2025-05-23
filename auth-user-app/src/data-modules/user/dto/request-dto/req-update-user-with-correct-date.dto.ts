import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ReqCreateUserWithCorrectDateDto } from '~src/data-modules/user/dto/request-dto/req-create-user-with-correct-date.dto';

export class ReqUpdateUserWithCorrectDateDto extends PartialType(
    ReqCreateUserWithCorrectDateDto,
) {
    @IsInt({ message: 'user id must be integer' })
    @IsNotEmpty({ message: 'user id is empty' })
    id: number;
}
