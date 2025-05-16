import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableServiceUser1743942137500 implements MigrationInterface {
    name = 'CreateTableServiceUser1743942137500';
    tableName = 'service_user';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "${this.tableName}"
            (
                "id"
                SERIAL
                PRIMARY
                KEY,
                "phone_number"
                VARCHAR
            (
                12
            ) NOT NULL UNIQUE,
                "password" TEXT NOT NULL,
                "first_name" TEXT,
                "last_name" TEXT,
                "second_name" TEXT,
                "birth_date" DATE NOT NULL,
                "email" TEXT
                )
        `);

        await queryRunner.query(
            `COMMENT ON TABLE "${this.tableName}" IS 'Users for application'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON TABLE "${this.tableName}" IS NULL`);
        await queryRunner.query(`DROP TABLE IF EXISTS "${this.tableName}";`);
    }
}
