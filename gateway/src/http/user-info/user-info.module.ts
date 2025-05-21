import { Module } from '@nestjs/common';
import { UserInfoController } from './user-info.controller';

@Module({
    imports: [],
    providers: [],
    controllers: [UserInfoController],
})
export class UserInfoModule {}
