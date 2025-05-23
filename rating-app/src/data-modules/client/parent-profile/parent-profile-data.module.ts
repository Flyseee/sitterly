import { Module } from '@nestjs/common';
import { ParentProfileDataService } from '~src/data-modules/client/parent-profile/parent-profile-data.service';

@Module({
    imports: [],
    providers: [ParentProfileDataService],
    exports: [ParentProfileDataService],
    controllers: [],
})
export class ParentProfileDataModule {}
