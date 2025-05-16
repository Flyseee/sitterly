import { MigrationInterface, QueryRunner } from 'typeorm';
import { AuthUtils } from '~src/utils/auth.utils';

export class InsertTableServiceUser1743942204009 implements MigrationInterface {
    name = 'InsertTableServiceUser1743942204009';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "service_user" (phone_number, password, first_name, last_name, second_name, birth_date, email)
            VALUES ('+70000000000', '${await AuthUtils.hashPassword('adminpassword')}', 'Василий', 'Васильев',
                    'Васильевич', NOW(), 'admin@gmail.com');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE
             FROM "service_user"
             where phone_number = '+70000000000';`,
        );
    }
}
