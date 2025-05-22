import { IsNotEmpty, IsString } from 'class-validator';

export class ReqCheckJwtDto {
    @IsString({ message: 'JWT token must be string' })
    @IsNotEmpty({ message: 'JWT token is empty' })
    token: string;
}
