import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Render,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HTTPTrace } from '~src/app/decorators/http-trace.decorator';
import { ReqLoginDto } from '~src/data-modules/auth/dto/request-dto/req-login.dto';
import { ReqRegisterDto } from '~src/data-modules/auth/dto/request-dto/req-register.dto';
import { ResLoginPageDto } from '~src/data-modules/auth/dto/response-dto/res-login-page.dto';
import { ResRegisterPageDto } from '~src/data-modules/auth/dto/response-dto/res-register-page.dto';
import { AuthService } from '~src/http/modules/auth/auth.service';

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Страница авторизации (логин)
     */
    @Get('/authorize')
    @Render('authorize')
    @HTTPTrace('AuthHttpService.authorizePage')
    @ApiOperation({
        summary: 'Страница авторизации',
        operationId: 'post-authorize',
    })
    authorizePage(
        @Query('client_id') clientId: string,
        @Query('redirect_uri') redirectUri: string,
        @Query('state') state?: string,
        @Query('error') error?: string,
    ): ResLoginPageDto {
        const params = `?redirect_uri=${redirectUri}${state ? `&state=${state}` : ''}${clientId ? `&client_id=${clientId}` : ''}`;
        const resLoginPage: ResLoginPageDto = { params, error: error || null };
        return resLoginPage;
    }

    /**
     * Обработка логина: проверяем учётные данные,
     * при успехе редиректим на redirect_uri с JWT,
     * при провале рендерим страницу с ошибкой.
     */
    @Post('/authorize')
    @ApiOperation({
        summary: 'Авторизация пользователя',
        operationId: 'get-authorize',
    })
    @ApiResponse({
        status: 302,
        description:
            'Успешная авторизация и переадресация на redirect_uri c параметром access_token',
    })
    @ApiBody({ type: ReqLoginDto })
    @UsePipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    )
    @HTTPTrace('AuthHttpService.authorize')
    async authorize(
        @Query('client_id') clientId: string,
        @Query('redirect_uri') redirectUri: string,
        @Query('state') state: string,
        @Body() loginDto: ReqLoginDto,
        @Res() res: Response,
    ) {
        const user = await this.authService.validateUser(loginDto);
        if (!user) {
            return res.status(401).render('authorize', {
                clientId,
                redirectUri,
                state,
                error: 'Неверный телефон или пароль',
            });
        }
        const { accessToken } = await this.authService.login(user);

        if (!redirectUri) {
            return res.redirect(
                `/v1/authorize?access_token=${accessToken}&error=${'redirect_uri_not_found'}`,
            );
        }

        const separator = redirectUri.includes('?') ? '&' : '?';
        return res.redirect(
            `${redirectUri}${separator}access_token=${accessToken}${state ? `&state=${state}` : ''}`,
        );
    }

    /**
     * Страница регистрации
     */
    @Get('/register')
    @Render('register')
    @HTTPTrace('AuthHttpService.registerPage')
    @ApiOperation({
        summary: 'Страница регистрации',
        operationId: 'get-register',
    })
    registerPage(
        @Query('client_id') clientId: string,
        @Query('redirect_uri') redirectUri: string,
        @Query('state') state?: string,
    ): ResRegisterPageDto {
        const params = `?redirect_uri=${redirectUri}${state ? `&state=${state}` : ''}${clientId ? `&client_id=${clientId}` : ''}`;
        const resRegisterPage: ResRegisterPageDto = { params, error: null };
        return resRegisterPage;
    }

    /**
     * Обработка регистрации: создаём пользователя,
     * затем редиректим на страницу авторизации.
     */
    @Post('/register')
    @ApiOperation({
        summary: 'Регистрация нового пользователя',
        operationId: 'post-register',
    })
    @ApiResponse({
        status: 201,
        description: 'Пользователь успешно зарегистрирован',
    })
    @ApiBody({ type: ReqRegisterDto })
    @UsePipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    )
    @HTTPTrace('AuthHttpService.register')
    async register(
        @Query('client_id') clientId: string,
        @Query('redirect_uri') redirectUri: string,
        @Query('state') state: string,
        @Body() registerDto: ReqRegisterDto,
        @Res() res: Response,
    ) {
        try {
            await this.authService.register(registerDto);
            const redirectUrl = `/v1/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
                redirectUri,
            )}${state ? `&state=${state}` : ''}`;
            return res.redirect(redirectUrl);
        } catch (e) {
            return res.status(400).render('register', {
                clientId,
                redirectUri,
                state,
                error: 'Ошибка регистрации',
            });
        }
    }
}
