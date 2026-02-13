import { IsNotEmpty, IsString } from 'class-validator';

export class ReqLoginDto {
    @IsString({ message: 'loginUser phoneNumber must be string' })
    @IsNotEmpty({ message: 'phoneNumber is empty' })
    phoneNumber: string;

    @IsString({ message: 'loginUser password must be string' })
    @IsNotEmpty({ message: 'password is empty' })
    password: string;
}
