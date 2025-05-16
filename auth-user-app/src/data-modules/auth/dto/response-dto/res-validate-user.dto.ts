export class ResValidateUserDto {
    id: number;
    phoneNumber: string;
    password: string;
    firstName?: string;
    lastName?: string;
    secondName?: string;
    birthDate?: Date;
    email?: string;
}
