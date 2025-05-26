import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReqLoginUserDto } from '~src/data-modules/auth/dto/request-dto/req-login-user.dto';
import { ReqLoginDto } from '~src/data-modules/auth/dto/request-dto/req-login.dto';
import { ReqRegisterDto } from '~src/data-modules/auth/dto/request-dto/req-register.dto';
import { ResLoginDto } from '~src/data-modules/auth/dto/response-dto/res-login.dto';
import { ResValidateUserDto } from '~src/data-modules/auth/dto/response-dto/res-validate-user.dto';
import { UserService } from '~src/data-modules/user/user.service';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

/**
 * Сервис авторизации: регистрация, проверка учётных данных, выдача JWT.
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly userDataService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Регистрирует нового пользователя.
     * @param ReqRegisterDto DTO для создания пользователя
     */
    @Trace('AuthService.register', { logInput: true, logOutput: true })
    async register(registerDto: ReqRegisterDto) {
        await this.userDataService.create({
            password: registerDto.password,
            phoneNumber: registerDto.phoneNumber,
        });
    }

    /**
     * Проверяет телефон и пароль, возвращает пользователя или null.
     */
    @Trace('AuthService.validateUser', { logInput: true, logOutput: true })
    async validateUser(
        loginDto: ReqLoginDto,
    ): Promise<ResValidateUserDto | null> {
        const resValidation: ResValidateUserDto | null =
            await this.userDataService.validateUser(loginDto);

        if (resValidation) {
            console.log('AuthService validateUser user id:' + resValidation.id);
        }
        return resValidation;
    }

    /**
     * Генерирует JWT для авторизованного пользователя.
     * @param ReqLoginUserDto DTO c cущностью пользователя
     */
    @Trace('AuthService.login', { logInput: true, logOutput: true })
    async login(loginUserDto: ReqLoginUserDto): Promise<ResLoginDto> {
        console.log('AuthService login user id:' + loginUserDto.id);
        const payload = {
            sub: loginUserDto.id,
            phoneNumber: loginUserDto.phoneNumber,
        };
        const resLogin: ResLoginDto = {
            accessToken: this.jwtService.sign(payload),
        };
        return resLogin;
    }
}
