import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ReqCreateParentProfileDto } from '~src/data-modules/parent-profile/dto/request-dto/req-create-parent-profile.dto';

export class ReqUpdateParentProfileDto extends PartialType(
    ReqCreateParentProfileDto,
) {
    @IsInt({ message: 'parentProfile id must be integer' })
    @IsNotEmpty({ message: 'parentProfile id is empty' })
    @Min(0)
    id: number;
}
