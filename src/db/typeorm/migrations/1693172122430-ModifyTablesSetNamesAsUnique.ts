import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTablesSetNamesAsUnique1693172122430 implements MigrationInterface {
    name = 'ModifyTablesSetNamesAsUnique1693172122430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cities\` ADD UNIQUE INDEX \`IDX_a0ae8d83b7d32359578c486e7f\` (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`technologies\` ADD UNIQUE INDEX \`IDX_46800813f460eb131823371cae\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`technologies\` DROP INDEX \`IDX_46800813f460eb131823371cae\``);
        await queryRunner.query(`ALTER TABLE \`cities\` DROP INDEX \`IDX_a0ae8d83b7d32359578c486e7f\``);
    }

}
