import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateParentProfileTable1744560698600
    implements MigrationInterface
{
    name: 'CreateParentProfileTable1744560698600';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS parent_profile
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
                NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS parent_profile;`);
    }
}
