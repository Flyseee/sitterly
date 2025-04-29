import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReviewsTable1744560698799 implements MigrationInterface {
    name: 'CreateReviewsTable1744560698799';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS review
            (
                id INTEGER PRIMARY KEY,
                profile_from_id INTEGER NOT NULL,
                profile_to_id INTEGER NOT NULL,
                profile_to_type profile_types NOT NULL,
                text VARCHAR(255),
                stars INTEGER NOT NULL,
                date DATE NOT NULL DEFAULT NOW(),
                is_considered BOOLEAN NOT NULL DEFAULT FALSE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS review;`);
    }
}
