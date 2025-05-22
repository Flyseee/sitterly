import { Module } from '@nestjs/common';
import { UserRatingController } from '~src/http/user-rating/user-rating.controller';

@Module({
    imports: [],
    providers: [],
    controllers: [UserRatingController],
})
export class UserRatingModule {}
