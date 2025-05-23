import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ReqCreateSitterProfileDto } from '~src/data-modules/client/sitter-profile/dto/request-dto/req-create-sitter-profile.dto';

export class ReqUpdateSitterProfileDto extends PartialType(
    ReqCreateSitterProfileDto,
) {
    @IsInt({ message: 'sitterProfile id must be integer' })
    @IsNotEmpty({ message: 'sitterProfile id is empty' })
    @Min(0)
    id: number;

    @IsInt({ message: 'sitterProfile ordersAmount must be integer' })
    @Min(0)
    ordersAmount?: number;

    @IsInt({ message: 'sitterProfile price must be integer' })
    @Min(0)
    price?: number;

    @IsString({ message: 'sitterProfile location must be string' })
    location?: string;
}
