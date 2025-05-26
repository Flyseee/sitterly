import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { OrderDateType } from '~src/data-modules/enums/order-date-type.enum';
import { ProfileType } from '~src/data-modules/enums/profile-type.enum';

export class ReqGetOrdersForUserDto {
    @IsInt({ message: 'order sitterId must be integer' })
    @IsNotEmpty({ message: 'sitterId is empty' })
    @Min(0)
    id: number;

    @IsEnum(ProfileType, {
        message: `profileType must be one of: ${Object.values(ProfileType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'profileType is empty' })
    profileType: ProfileType;

    @IsEnum(OrderDateType, {
        message: `orderType must be one of: ${Object.values(OrderDateType).join(', ')}`,
    })
    @IsNotEmpty({ message: 'orderType is empty' })
    orderDateType: OrderDateType;
}
