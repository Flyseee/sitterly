import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReviewsTable1744560698799 implements MigrationInterface {
    name: 'CreateReviewsTable1744560698799';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS reviews
            (
                id INTEGER PRIMARY KEY,
                profile_from_id INTEGER,
                profile_to_id INTEGER,
                profile_type profile_types,
                text VARCHAR(255),
                stars INTEGER
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS reviews;`);
    }
}
