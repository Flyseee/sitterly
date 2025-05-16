import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

/**
 * Модель данных пользователя с валидацией
 */
export class UpdateUserInfoDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    /**
     * Телефон в формате +7XXXXXXXXXX
     */
    @IsString({ message: 'Телефон должен быть строкой' })
    @Matches(/^\+7\d{10}$/, {
        message: 'Телефон должен быть в формате +7XXXXXXXXXX',
    })
    @IsOptional()
    phoneNumber?: string;

    /**
     * Имя пользователя (опционально)
     */
    @IsOptional()
    @IsString({ message: 'Имя должно быть строкой' })
    firstName?: string;

    /**
     * Фамилия пользователя (опционально)
     */
    @IsOptional()
    @IsString({ message: 'Фамилия должна быть строкой' })
    lastName?: string;

    /**
     * Электронная почта (опционально)
     */
    @IsOptional()
    @IsEmail({}, { message: 'Некорректный email' })
    email?: string;
}
