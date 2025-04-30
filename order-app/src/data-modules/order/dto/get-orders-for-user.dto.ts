import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Entity } from 'typeorm';
import { ProfileType } from '~src/data-modules/order/enums/profile-type.enum';

@Entity()
export class GetOrdersForUserDto {
    @IsInt({ message: 'order sitterId must be integer' })
    @IsNotEmpty({ message: 'sitterId is empty' })
    @Min(0)
    id: number;

    @IsEnum(ProfileType, {
        message: `profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profileType is empty' })
    profileType: ProfileType;
}
