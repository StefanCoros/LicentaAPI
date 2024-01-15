import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyCitiesTableSetLongitudeAndLatitudeColumnsNullable1705337976135 implements MigrationInterface {
    name = 'ModifyCitiesTableSetLongitudeAndLatitudeColumnsNullable1705337976135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cities\` CHANGE \`latitude\` \`latitude\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`cities\` CHANGE \`longitude\` \`longitude\` float NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cities\` CHANGE \`longitude\` \`longitude\` float NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cities\` CHANGE \`latitude\` \`latitude\` float NOT NULL`);
    }

}
