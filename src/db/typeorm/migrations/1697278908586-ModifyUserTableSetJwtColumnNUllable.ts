import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserTableSetJwtColumnNUllable1697278908586 implements MigrationInterface {
    name = 'ModifyUserTableSetJwtColumnNUllable1697278908586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`jwt\` \`jwt\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`jwt\` \`jwt\` text NOT NULL`);
    }

}
