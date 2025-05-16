import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSitterProfileTable1744560698699
    implements MigrationInterface
{
    name: 'CreateSitterProfileTable1744560698699';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS sitter_profile
            (
                "id"
                SERIAL
                INTEGER
                PRIMARY
                KEY,
                "orders_amount"
                INTEGER
                DEFAULT
                0
                NOT
                NULL,
                "price"
                INTEGER,
                "location"
                TEXT
                NOT
                NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS sitter_profile;`);
    }
}
