import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTablesJobsAndTechnologiesAddManyToManyRelation1699990393538 implements MigrationInterface {
    name = 'ModifyTablesJobsAndTechnologiesAddManyToManyRelation1699990393538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`technologies\` DROP FOREIGN KEY \`FK_56482e7a2017c2b8f426a51efb6\``);
        await queryRunner.query(`CREATE TABLE \`jobs_technology_stack_technologies\` (\`jobsId\` int NOT NULL, \`technologiesId\` int NOT NULL, INDEX \`IDX_24005a5337b17fbeafb15944ff\` (\`jobsId\`), INDEX \`IDX_03d5686c0b697845f9ef6154f6\` (\`technologiesId\`), PRIMARY KEY (\`jobsId\`, \`technologiesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`technologies\` DROP COLUMN \`jobId\``);
        await queryRunner.query(`ALTER TABLE \`jobs_technology_stack_technologies\` ADD CONSTRAINT \`FK_24005a5337b17fbeafb15944ffc\` FOREIGN KEY (\`jobsId\`) REFERENCES \`jobs\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`jobs_technology_stack_technologies\` ADD CONSTRAINT \`FK_03d5686c0b697845f9ef6154f67\` FOREIGN KEY (\`technologiesId\`) REFERENCES \`technologies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jobs_technology_stack_technologies\` DROP FOREIGN KEY \`FK_03d5686c0b697845f9ef6154f67\``);
        await queryRunner.query(`ALTER TABLE \`jobs_technology_stack_technologies\` DROP FOREIGN KEY \`FK_24005a5337b17fbeafb15944ffc\``);
        await queryRunner.query(`ALTER TABLE \`technologies\` ADD \`jobId\` int NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_03d5686c0b697845f9ef6154f6\` ON \`jobs_technology_stack_technologies\``);
        await queryRunner.query(`DROP INDEX \`IDX_24005a5337b17fbeafb15944ff\` ON \`jobs_technology_stack_technologies\``);
        await queryRunner.query(`DROP TABLE \`jobs_technology_stack_technologies\``);
        await queryRunner.query(`ALTER TABLE \`technologies\` ADD CONSTRAINT \`FK_56482e7a2017c2b8f426a51efb6\` FOREIGN KEY (\`jobId\`) REFERENCES \`jobs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
