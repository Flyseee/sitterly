import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Match } from '~src/app/decorators/match.decorator';

export class ReqRegisterDto {
    @ApiProperty({
        description: 'Номер телефона в формате +7XXXXXXXXXX (Россия)',
        example: '+71234567890',
    })
    @IsString({ message: 'register phoneNumber must be string' })
    @IsNotEmpty({ message: 'register phoneNumber is empty' })
    @Matches(/^\+7\d{10}$/, {
        message: 'login phoneNumber must be in format +7XXXXXXXXXX',
    })
    phoneNumber: string;

    @ApiProperty({
        description:
            'Пароль длиной минимум 8 символов, содержит заглавную и строчную буквы, цифры и спецсимвол',
        example: 'P@ssw0rd!',
    })
    @IsString({ message: 'register password must be string' })
    @IsNotEmpty({ message: 'register password is empty' })
    @MinLength(8, {
        message: 'register password  must be at least 8 characters long',
    })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
            'login password must contain uppercase and lowercase letters, numbers and special characters',
    })
    password: string;

    @ApiProperty({
        description: 'Повтор пароля (должен совпадать с полем password)',
        example: 'P@ssw0rd!',
    })
    @IsString({ message: 'register confirmPassword must be string' })
    @IsNotEmpty({ message: 'register confirmPassword is empty' })
    @Match('password', {
        message: 'Passwords do not match',
    })
    confirmPassword: string;
}
