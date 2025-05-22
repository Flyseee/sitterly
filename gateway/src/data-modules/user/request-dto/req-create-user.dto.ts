import {
    IsDate,
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

export class ReqCreateUserDto {
    @IsString({ message: 'user phoneNumber must be string' })
    @IsNotEmpty({ message: 'phoneNumber is empty' })
    @Matches(/^\+7\d{10}$/, {
        message: 'user phoneNumber must be in format +7XXXXXXXXXX',
    })
    phoneNumber: string;

    @IsString({ message: 'user password must be string' })
    @IsNotEmpty({ message: 'user password is empty' })
    @MinLength(8, {
        message: 'user password  must be at least 8 characters long',
    })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
            'user password must contain uppercase and lowercase letters, numbers and special characters',
    })
    password: string;

    @IsInt({ message: 'user sitterProfileId must be integer' })
    sitterProfileId?: number;

    @IsInt({ message: 'user parentProfileId must be integer' })
    parentProfileId?: number;

    @IsString({ message: 'user firstName must be string' })
    firstName?: string;

    @IsString({ message: 'user lastName must be string' })
    lastName?: string;

    @IsString({ message: 'user secondName must be string' })
    secondName?: string;

    @IsDate({ message: 'user birthDate must be date' })
    birthDate?: Date;

    @IsString({ message: 'user email must be string' })
    email?: string;
}
