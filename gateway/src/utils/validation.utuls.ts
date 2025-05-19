import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GrpcStatusCode } from '~src/app/filter/grpc-status-code.enum';

export class ValidationUtils {
    static async validateInput<T extends object>(
        dtoClass: new () => T,
        payload: any,
    ): Promise<T> {
        const instance = plainToInstance(dtoClass, payload);
        const errors = await validate(instance);
        if (errors.length > 0) {
            throw new RpcException({
                message: errors
                    .map((e) => Object.values(e.constraints || {}))
                    .flat(),
                code: GrpcStatusCode.INVALID_ARGUMENT,
            });
        }
        return instance;
    }
}
