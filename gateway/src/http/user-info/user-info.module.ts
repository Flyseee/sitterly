import { Module } from '@nestjs/common';
import { UserModule } from '~src/data-modules/user/user.module';
import { UserInfoController } from './user-info.controller';

@Module({
    imports: [UserModule],
    providers: [],
    controllers: [UserInfoController],
})
export class UserInfoModule {}
