import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApplicationTable1743795951707 implements MigrationInterface {
    name = 'CreateApplicationTable1743795951707';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "application"
            (
                id
                INTEGER
                PRIMARY
                KEY,
                order_id
                INTEGER
                NOT
                NULL
                REFERENCES
                "order"
            (
                id
            ),
                sitter_id INTEGER NOT NULL,
                is_actual BOOLEAN NOT NULL DEFAULT TRUE
                )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "application";`);
    }
}
