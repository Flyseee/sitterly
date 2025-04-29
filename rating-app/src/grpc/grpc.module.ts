import { Module } from '@nestjs/common';
import { UserRatingModule } from '~src/grpc/modules/userRating/user-rating.module';

@Module({
    imports: [UserRatingModule],
})
export class GrpcModule {}
