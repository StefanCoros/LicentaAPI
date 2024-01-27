import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkJobsAndCitiesTables1706346593238 implements MigrationInterface {
    name = 'LinkJobsAndCitiesTables1706346593238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`jobs_cities_cities\` (\`jobsId\` int NOT NULL, \`citiesId\` int NOT NULL, INDEX \`IDX_2cc879900ecb0a002f9809c73b\` (\`jobsId\`), INDEX \`IDX_f65f56b3fab03145f7c40d407e\` (\`citiesId\`), PRIMARY KEY (\`jobsId\`, \`citiesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`jobs_cities_cities\` ADD CONSTRAINT \`FK_2cc879900ecb0a002f9809c73b2\` FOREIGN KEY (\`jobsId\`) REFERENCES \`jobs\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`jobs_cities_cities\` ADD CONSTRAINT \`FK_f65f56b3fab03145f7c40d407ed\` FOREIGN KEY (\`citiesId\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jobs_cities_cities\` DROP FOREIGN KEY \`FK_f65f56b3fab03145f7c40d407ed\``);
        await queryRunner.query(`ALTER TABLE \`jobs_cities_cities\` DROP FOREIGN KEY \`FK_2cc879900ecb0a002f9809c73b2\``);
        await queryRunner.query(`DROP INDEX \`IDX_f65f56b3fab03145f7c40d407e\` ON \`jobs_cities_cities\``);
        await queryRunner.query(`DROP INDEX \`IDX_2cc879900ecb0a002f9809c73b\` ON \`jobs_cities_cities\``);
        await queryRunner.query(`DROP TABLE \`jobs_cities_cities\``);
    }

}
