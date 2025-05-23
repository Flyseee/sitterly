import { Module } from '@nestjs/common';
import { SitterProfileDataService } from './sitter-profile-data.service';

@Module({
    imports: [],
    providers: [SitterProfileDataService],
    exports: [SitterProfileDataService],
    controllers: [],
})
export class SitterProfileDataModule {}
