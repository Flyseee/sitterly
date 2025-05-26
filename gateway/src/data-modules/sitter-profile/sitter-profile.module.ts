import { Module } from '@nestjs/common';
import { SitterProfileService } from './sitter-profile.service';

@Module({
    imports: [],
    providers: [SitterProfileService],
    controllers: [],
    exports: [SitterProfileService],
})
export class SitterProfileModule {}
