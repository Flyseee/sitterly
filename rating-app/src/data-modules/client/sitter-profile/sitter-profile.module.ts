import { Module } from '@nestjs/common';
import { SitterProfileDataService } from './sitter-profile.service';

@Module({
    imports: [],
    providers: [SitterProfileDataService],
    controllers: [],
})
export class SitterProfileModule {}
