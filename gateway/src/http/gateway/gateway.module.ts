import { Module } from '@nestjs/common';
import { ApplicationModule } from '~src/data-modules/application/application.module';
import { OrderModule } from '~src/data-modules/order/order.module';
import { ParentProfileModule } from '~src/data-modules/parent-profile/parent-profile.module';
import { RatingModule } from '~src/data-modules/rating/rating.module';
import { ReviewModule } from '~src/data-modules/review/review.module';
import { SitterProfileModule } from '~src/data-modules/sitter-profile/sitter-profile.module';
import { UserModule } from '~src/data-modules/user/user.module';
import { GatewayController } from './gateway.controller';

@Module({
    imports: [
        UserModule,
        ParentProfileModule,
        SitterProfileModule,
        OrderModule,
        ApplicationModule,
        RatingModule,
        ReviewModule,
    ],
    providers: [],
    controllers: [GatewayController],
})
export class GatewayModule {}
