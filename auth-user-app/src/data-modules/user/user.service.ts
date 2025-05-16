import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReqLoginDto } from '~src/data-modules/auth/dto/request-dto/req-login.dto';
import { ReqGetUserDto } from '~src/data-modules/user/dto/request-dto/req-get-user.dto';
import { UserEntity } from '~src/data-modules/user/entities/user.entity';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';
import { AuthUtils } from '~src/utils/auth.utils';
import { ReqCreateUserDto } from './dto/request-dto/req-create-user.dto';
import { ReqUpdateUserDto } from './dto/request-dto/req-update-user.dto';

/**
 * Сервис для управления сущностями пользователей.
 * Отвечает за создание, получение, обновление и удаление пользователей,
 * а также за валидацию учетных данных.
 */
@Injectable()
export class UserService {
    /**
     * @param userEntityRepository Репозиторий для работы с сущностью UserEntity.
     */
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userEntityRepository: Repository<UserEntity>,
    ) {}

    /**
     * Находит пользователя по его ID.
     * @param getUserDto DTO с id пользователя.
     * @returns Promise, возвращающий найденную сущность UserEntity или null, если не найден.
     */
    @Trace('UserService.findOne', { logInput: true, logOutput: true })
    async findOne(getUserDto: ReqGetUserDto): Promise<UserEntity | null> {
        return await this.userEntityRepository.findOneBy({ id: getUserDto.id });
    }

    /**
     * Обновляет данные существующего пользователя.
     * При наличии нового пароля выполняет его хеширование.
     * @param updateUserDto DTO с новыми данными пользователя.
     * @returns Promise, возвращающий обновленную сущность UserEntity или null, если пользователь не найден.
     */
    @Trace('UserService.update', { logInput: true, logOutput: true })
    async update(updateUserDto: ReqUpdateUserDto): Promise<UserEntity | null> {
        if (updateUserDto.password) {
            updateUserDto.password = await AuthUtils.hashPassword(
                updateUserDto.password,
            );
        }

        return this.userEntityRepository.save(updateUserDto);
    }

    /**
     * Создает нового пользователя и сохраняет его в базу данных.
     * @param createUserDto DTO с данными для создания пользователя.
     * @returns Promise, возвращающий созданную сущность UserEntity.
     */
    @Trace('UserService.create', { logInput: true, logOutput: true })
    async create(createUserDto: ReqCreateUserDto): Promise<UserEntity> {
        const { phoneNumber, password, ...rest } = createUserDto;
        const hashed = await AuthUtils.hashPassword(password);
        const user = this.userEntityRepository.create({
            phoneNumber,
            password: hashed,
            ...rest,
        });
        return this.userEntityRepository.save(user);
    }

    /**
     * Валидирует пользователя по номеру телефона и паролю.
     * Используется для аутентификации.
     * @param loginDto DTO с данными для валидации пользователя.
     * @returns Promise, возвращающий сущность UserEntity при успешной верификации или null при неудаче.
     */
    @Trace('UserService.validateUser', { logInput: true, logOutput: true })
    async validateUser(loginDto: ReqLoginDto): Promise<UserEntity | null> {
        const user = await this.userEntityRepository.findOne({
            where: { phoneNumber: loginDto.phoneNumber },
        });
        if (
            user &&
            (await AuthUtils.verifyPassword(user.password, loginDto.password))
        ) {
            return user;
        }
        return null;
    }

    /**
     * Возвращает список всех пользователей.
     * @returns Promise, возвращающий массив сущностей UserEntity.
     */
    @Trace('UserService.findAll', { logInput: true, logOutput: true })
    async findAll(): Promise<UserEntity[]> {
        return this.userEntityRepository.find();
    }

    /**
     * Удаляет пользователя по его ID.
     * @param id Идентификатор пользователя.
     * @returns Promise, возвращающий удаленную сущность UserEntity или null, если пользователь не найден.
     */
    @Trace('UserService.remove', { logInput: true, logOutput: true })
    async remove(id: number): Promise<UserEntity | null> {
        const user = await this.findOne({ id });
        if (user) return await this.userEntityRepository.remove(user);
        return user;
    }
}
