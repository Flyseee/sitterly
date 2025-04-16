import { Module } from '@nestjs/common';
import { VersionModule } from '~src/grpc/modules/version/version.module';
import { UserRatingModule } from '~src/grpc/modules/userRating/userRating.module';

@Module({
    imports: [VersionModule, UserRatingModule],
})
export class GrpcModule {}
