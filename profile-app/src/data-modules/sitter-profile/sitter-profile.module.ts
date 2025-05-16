import { Module } from '@nestjs/common';
import sitterProfileRepositoryProvider from '~src/data-modules/sitter-profile/provider/sitter-profile-repository-provider';
import { SitterProfileService } from '~src/data-modules/sitter-profile/sitter-profile.service';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';

@Module({
    imports: [PostgresqlModule],
    providers: [SitterProfileService, sitterProfileRepositoryProvider],
    exports: [SitterProfileService],
})
export class SitterProfileModule {}
