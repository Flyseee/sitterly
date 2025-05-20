import { Module } from '@nestjs/common';
import { UserInfoTestController } from './user-info-test.controller';

@Module({
    imports: [],
    controllers: [UserInfoTestController],
    providers: [],
})
export class UserInfoTestModule {}
