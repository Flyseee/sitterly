import { Module } from '@nestjs/common';
import { UserRatingModule } from '~src/grpc/modules/user-rating/user-rating.module';

@Module({
    imports: [UserRatingModule],
})
export class GrpcModule {}
