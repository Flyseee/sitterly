import { Module } from '@nestjs/common';
import { UserModule } from '~src/data-modules/user/user.module';
import { UserInfoController } from '~src/grpc/modules/user-info/user-info.controller';
import { S3Module } from '~src/storage-modules/s3/s3.module';
import { UserInfoService } from './user-info.service';

@Module({
    imports: [S3Module, UserModule],
    controllers: [UserInfoController],
    providers: [UserInfoService],
})
export class UserInfoModule {}
