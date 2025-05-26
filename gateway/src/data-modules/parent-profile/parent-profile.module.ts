import { Module } from '@nestjs/common';
import { ParentProfileService } from '~src/data-modules/parent-profile/parent-profile.service';

@Module({
    imports: [],
    providers: [ParentProfileService],
    controllers: [],
    exports: [ParentProfileService],
})
export class ParentProfileModule {}
