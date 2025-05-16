import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ReqLoginDto {
    @ApiProperty({
        description: 'Номер телефона в формате +7XXXXXXXXXX (Россия)',
        example: '+71234567890',
    })
    @IsString({ message: 'login phoneNumber must be string' })
    @IsNotEmpty({ message: 'phoneNumber is empty' })
    @Matches(/^\+7\d{10}$/, {
        message: 'login phoneNumber must be in format +7XXXXXXXXXX',
    })
    phoneNumber: string;

    @ApiProperty({
        description: 'Пароль пользователя',
        example: 'P@ssw0rd!',
    })
    @IsString({ message: 'login password must be string' })
    @IsNotEmpty({ message: 'password is empty' })
    password: string;
}
