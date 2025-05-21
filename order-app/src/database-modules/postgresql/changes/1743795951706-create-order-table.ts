import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1743795951706 implements MigrationInterface {
    name = 'CreateOrderTable1743795951706';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "order"
            (
                id
                INTEGER
                SERIAL
                PRIMARY
                KEY,
                parent_id
                INTEGER
                NOT
                NULL,
                sitter_id
                INTEGER
                NOT
                NULL,
                description
                VARCHAR
            (
                500
            ) NOT NULL,
                location VARCHAR
            (
                255
            ) NOT NULL,
                duration_hours INTEGER NOT NULL,
                duration_minutes INTEGER NOT NULL,
                cost INTEGER NOT NULL,
                kids_description VARCHAR
            (
                500
            ) NOT NULL,
                date TIMESTAMPTZ NOT NULL
                )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order";`);
    }
}
