import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRatingTable1744560698699 implements MigrationInterface {
    name: 'CreateRatingTable1744560698699';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS rating (
                id INTEGER PRIMARY KEY,
                rating NUMERIC,
                reviews_amount INTEGER
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS rating;`);
    }
}
