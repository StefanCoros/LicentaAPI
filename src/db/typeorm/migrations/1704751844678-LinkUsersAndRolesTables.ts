import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkUsersAndRolesTables1704751844678 implements MigrationInterface {
    name = 'LinkUsersAndRolesTables1704751844678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`roleId\` enum ('Admin', 'Standard', 'Premium') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`roleId\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`roleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`roleId\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`roleId\` enum ('Admin', 'Standard', 'Premium') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`role\` enum ('Admin', 'Standard', 'Premium') NOT NULL`);
    }

}
