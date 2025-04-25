import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRatingTable1744560698699 implements MigrationInterface {
    name: 'CreateRatingTable1744560698699';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE profile_types AS ENUM ('SITTER', 'PARENT');`,
        );

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS rating
            (
                profile_id INTEGER,
                profile_type profile_types,
                rating NUMERIC,
                reviews_amount INTEGER,
                PRIMARY KEY
                (
                    profile_id,
                    profile_type
                )
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS rating;`);
    }
}
