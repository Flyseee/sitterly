import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Сущность пользователя сервиса
 */
@Entity({ name: 'service_user' })
export class UserEntity {
    /**
     * Уникальный идентификатор пользователя
     * @type integer (SERIAL PRIMARY KEY)
     */
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    /**
     * Номер телефона в формате +7XXXXXXXXXX
     * @type varchar(12), NOT NULL, UNIQUE
     * @description Phone number
     */
    @Column({
        type: 'varchar',
        length: 12,
        name: 'phone_number',
        unique: true,
        nullable: false,
    })
    phoneNumber: string;

    /**
     * Хеш пароля пользователя
     * @type text, NOT NULL
     * @description password
     */
    @Column({
        type: 'text',
        name: 'password',
        nullable: false,
    })
    password: string;

    /**
     * Идентификатор профиля ситтера
     * @type integer, NULLABLE
     * @description sitter_profile_id
     */
    @Column({
        type: 'int',
        name: 'sitter_profile_id',
        nullable: true,
    })
    sitterProfileId: number;

    /**
     * Идентификатор профиля родителя
     * @type integer, NULLABLE
     * @description parent_profile_id
     */
    @Column({
        type: 'int',
        name: 'parent_profile_id',
        nullable: true,
    })
    parentProfileId: number;

    /**
     * Имя пользователя
     * @type text, NULLABLE
     * @description first_name
     */
    @Column({
        type: 'text',
        name: 'first_name',
        nullable: true,
    })
    firstName: string;

    /**
     * Фамилия пользователя
     * @type text, NULLABLE
     * @description last_name
     */
    @Column({
        type: 'text',
        name: 'last_name',
        nullable: true,
        comment: 'last_name',
    })
    lastName: string;

    /**
     * Отчество пользователя
     * @type text, NULLABLE
     * @description second_name
     */
    @Column({
        type: 'text',
        name: 'second_name',
        nullable: true,
        comment: 'second_name',
    })
    secondName: string;

    /**
     * Дата рождения пользователя
     * @type date, NULLABLE
     * @description birth_date
     */
    @Column({
        type: 'timestamptz',
        name: 'birth_date',
        nullable: true,
        comment: 'birth_date',
    })
    birthDate: Date;

    /**
     * Адрес электронной почты пользователя
     * @type varchar(255), NULLABLE, UNIQUE
     * @description email
     */
    @Column({
        type: 'varchar',
        length: 255,
        name: 'email',
        unique: true,
        nullable: true,
        comment: 'email',
    })
    email: string;
}
