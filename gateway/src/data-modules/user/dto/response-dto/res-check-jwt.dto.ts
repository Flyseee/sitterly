export class ResCheckJwtDto {
    id: number;
    phoneNumber: string;
    password: string;
    sitterProfileId?: number;
    parentProfileId?: number;
    firstName?: string;
    lastName?: string;
    secondName?: string;
    birthDate?: Date;
    email?: string;
    avatarUrl?: string;
}
