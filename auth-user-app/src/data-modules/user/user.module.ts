import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import userRepositoryProvider from '~src/data-modules/user/provider/user-repository.provider';
import { PostgresqlModule } from '~src/storage-modules/postgresql/postgresql.module';

@Module({
    imports: [PostgresqlModule],
    providers: [UserService, userRepositoryProvider],
    exports: [UserService],
})
export class UserModule {}
