import { Module } from '@nestjs/common';
import { ParentProfileDataModule } from '~src/data-modules/client/parent-profile/parent-profile-data.module';
import { SitterProfileDataModule } from '~src/data-modules/client/sitter-profile/sitter-profile-data.module';
import { UserModule } from '~src/data-modules/user/user.module';
import { UserInfoController } from '~src/grpc/modules/user-info/user-info.controller';
import { S3Module } from '~src/storage-modules/s3/s3.module';
import { UserInfoService } from './user-info.service';

@Module({
    imports: [
        S3Module,
        UserModule,
        SitterProfileDataModule,
        ParentProfileDataModule,
    ],
    controllers: [UserInfoController],
    providers: [UserInfoService],
})
export class UserInfoModule {}
