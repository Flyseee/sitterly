import { Module } from '@nestjs/common';
import { FuncParentProfileController } from '~src/http/func-parent-profile/func-parent-profile.controller';

@Module({
    imports: [],
    providers: [],
    controllers: [FuncParentProfileController],
})
export class FuncParentProfileModule {}
