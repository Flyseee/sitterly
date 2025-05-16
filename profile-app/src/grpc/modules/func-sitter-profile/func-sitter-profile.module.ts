import { Module } from '@nestjs/common';
import { SitterProfileModule } from '~src/data-modules/sitter-profile/sitter-profile.module';
import { FuncSitterProfileController } from '~src/grpc/modules/func-sitter-profile/func-sitter-profile.controller';
import { FuncSitterProfileService } from '~src/grpc/modules/func-sitter-profile/func-sitter-profile.service';

@Module({
    imports: [SitterProfileModule],
    providers: [FuncSitterProfileService],
    controllers: [FuncSitterProfileController],
})
export class FuncSitterProfileModule {}
