import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesTable1693172757042 implements MigrationInterface {
    name = 'CreateRolesTable1693172757042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` (\`role\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
