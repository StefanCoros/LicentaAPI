import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkUsersAndTechnologiesTables1702845354860 implements MigrationInterface {
    name = 'LinkUsersAndTechnologiesTables1702845354860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users_technologies_technologies\` (\`usersId\` int NOT NULL, \`technologiesId\` int NOT NULL, INDEX \`IDX_4b183e88b3aae55a5fe57087c8\` (\`usersId\`), INDEX \`IDX_a240ffc539cbea3857c1f147b3\` (\`technologiesId\`), PRIMARY KEY (\`usersId\`, \`technologiesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users_technologies_technologies\` ADD CONSTRAINT \`FK_4b183e88b3aae55a5fe57087c8e\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_technologies_technologies\` ADD CONSTRAINT \`FK_a240ffc539cbea3857c1f147b34\` FOREIGN KEY (\`technologiesId\`) REFERENCES \`technologies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_technologies_technologies\` DROP FOREIGN KEY \`FK_a240ffc539cbea3857c1f147b34\``);
        await queryRunner.query(`ALTER TABLE \`users_technologies_technologies\` DROP FOREIGN KEY \`FK_4b183e88b3aae55a5fe57087c8e\``);
        await queryRunner.query(`DROP INDEX \`IDX_a240ffc539cbea3857c1f147b3\` ON \`users_technologies_technologies\``);
        await queryRunner.query(`DROP INDEX \`IDX_4b183e88b3aae55a5fe57087c8\` ON \`users_technologies_technologies\``);
        await queryRunner.query(`DROP TABLE \`users_technologies_technologies\``);
    }

}
