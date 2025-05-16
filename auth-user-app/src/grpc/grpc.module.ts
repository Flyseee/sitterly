import { Module } from '@nestjs/common';
import { UserInfoModule } from './modules/user-info/user-info.module';

@Module({
    imports: [UserInfoModule],
})
export class GrpcModule {}
