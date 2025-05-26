import { Module } from '@nestjs/common';
import { ApplicationService } from '~src/data-modules/application/application.service';

@Module({
    imports: [],
    providers: [ApplicationService],
    controllers: [],
})
export class ApplicationModule {}
