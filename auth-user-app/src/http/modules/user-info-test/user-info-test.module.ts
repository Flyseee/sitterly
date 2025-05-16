import { Module } from '@nestjs/common';
import { UserInfoTestController } from './user-info-test.controller';
import { UserModule } from '~src/data-modules/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [UserInfoTestController],
    providers: [],
})
export class UserInfoTestModule {}
