import { Module } from '@nestjs/common';
import { ParentProfileModule } from '~src/data-modules/parent-profile/parent-profile.module';
import { FuncParentProfileController } from '~src/grpc/modules/func-parent-profile/func-parent-profile.controller';
import { FuncParentProfileService } from '~src/grpc/modules/func-parent-profile/func-parent-profile.service';

@Module({
    imports: [ParentProfileModule],
    providers: [FuncParentProfileService],
    controllers: [FuncParentProfileController],
})
export class FuncParentProfileModule {}
