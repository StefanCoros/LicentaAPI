import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserTableAddJwtColumn1697276166273 implements MigrationInterface {
    name = 'ModifyUserTableAddJwtColumn1697276166273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`jwt\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`jwt\``);
    }

}
