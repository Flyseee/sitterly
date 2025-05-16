import { Module } from '@nestjs/common';
import { ParentProfileService } from '~src/data-modules/parent-profile/parent-profile.service';
import parentProfileRepositoryProvider from '~src/data-modules/parent-profile/provider/parent-profile-repository-provider';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';

@Module({
    imports: [PostgresqlModule],
    providers: [ParentProfileService, parentProfileRepositoryProvider],
    exports: [ParentProfileService],
})
export class ParentProfileModule {}
