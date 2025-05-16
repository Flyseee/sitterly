import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ReqCreateSitterProfileDto } from '~src/data-modules/sitter-profile/dto/request-dto/req-create-sitter-profile.dto';

export class ReqUpdateSitterProfileDto extends PartialType(
    ReqCreateSitterProfileDto,
) {
    @IsInt({ message: 'sitterProfile id must be integer' })
    @IsNotEmpty({ message: 'sitterProfile id is empty' })
    @Min(0)
    id: number;
}
