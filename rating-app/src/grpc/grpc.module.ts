import { Module } from '@nestjs/common';
import { UserRatingModule } from '~src/grpc/modules/userRating/userRating.module';

@Module({
    imports: [UserRatingModule],
})
export class GrpcModule {}
