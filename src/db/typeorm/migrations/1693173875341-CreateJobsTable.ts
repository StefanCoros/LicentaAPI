import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobsTable1693173875341 implements MigrationInterface {
    name = 'CreateJobsTable1693173875341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`jobs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`company\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`salary\` varchar(255) NOT NULL, \`employeesNumber\` varchar(255) NOT NULL, \`companyType\` varchar(255) NOT NULL, \`experienceLevel\` varchar(255) NOT NULL, \`postType\` varchar(255) NOT NULL, \`language\` varchar(255) NOT NULL, \`requirements\` text NOT NULL, \`responsibilities\` text NOT NULL, \`description\` text NOT NULL, \`link\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`technologies\` ADD \`jobId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`technologies\` ADD CONSTRAINT \`FK_56482e7a2017c2b8f426a51efb6\` FOREIGN KEY (\`jobId\`) REFERENCES \`jobs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`technologies\` DROP FOREIGN KEY \`FK_56482e7a2017c2b8f426a51efb6\``);
        await queryRunner.query(`ALTER TABLE \`technologies\` DROP COLUMN \`jobId\``);
        await queryRunner.query(`DROP TABLE \`jobs\``);
    }

}
