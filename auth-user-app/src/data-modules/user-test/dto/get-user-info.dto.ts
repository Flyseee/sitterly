import { UpdateUserInfoDto } from '~src/data-modules/user-test/dto/update-user-info.dto';

export class GetUserInfoDto extends UpdateUserInfoDto {
    avatarUrl?: string;
}
