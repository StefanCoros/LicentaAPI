import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserTableModifyAddResetPasswordColumns1697323180813 implements MigrationInterface {
    name = 'ModifyUserTableModifyAddResetPasswordColumns1697323180813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`resetPasswordToken\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`resetPasswordTokenExpiredAt\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetPasswordTokenExpiredAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetPasswordToken\``);
    }

}
