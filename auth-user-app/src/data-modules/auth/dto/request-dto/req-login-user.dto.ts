import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ReqLoginUserDto {
    @IsInt({ message: 'loginUser id must be integer' })
    @IsNotEmpty({ message: 'id is empty' })
    id: number;

    @IsString({ message: 'loginUser phoneNumber must be string' })
    @IsNotEmpty({ message: 'phoneNumber is empty' })
    phoneNumber: string;

    @IsString({ message: 'loginUser password must be string' })
    @IsNotEmpty({ message: 'password is empty' })
    password: string;

    @IsString({ message: 'loginUser firstName must be string' })
    firstName?: string;

    @IsString({ message: 'loginUser lastName must be string' })
    lastName?: string;

    @IsString({ message: 'loginUser secondName must be string' })
    secondName?: string;

    @IsDate({ message: 'loginUser birthDate must be date' })
    birthDate?: Date;

    @IsString({ message: 'loginUser email must be string' })
    email?: string;
}
