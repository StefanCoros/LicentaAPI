import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserTableModifyJwtColumnType1697276296248 implements MigrationInterface {
    name = 'ModifyUserTableModifyJwtColumnType1697276296248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`jwt\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`jwt\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`jwt\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`jwt\` varchar(255) NOT NULL`);
    }

}
