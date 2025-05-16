import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IsBuffer } from '~src/app/decorators/is-buffer.decorator';

export class ReqUploadAvatarDto {
    @IsInt({ message: 'user id must be integer' })
    @IsNotEmpty({ message: 'user id is empty' })
    id: number;

    @IsString({ message: 'avatar filename must be string' })
    @IsNotEmpty({ message: 'avatar filename is empty' })
    filename: string;

    @IsBuffer({ message: 'avatar fileData must be buffer' })
    @IsNotEmpty({ message: 'avatar fileData is empty' })
    fileData: Buffer;
}
