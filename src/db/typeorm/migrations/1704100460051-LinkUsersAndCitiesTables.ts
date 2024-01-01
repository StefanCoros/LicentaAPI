import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkUsersAndCitiesTables1704100460051 implements MigrationInterface {
    name = 'LinkUsersAndCitiesTables1704100460051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users_cities_cities\` (\`usersId\` int NOT NULL, \`citiesId\` int NOT NULL, INDEX \`IDX_b9593b403ceffb58faab1cd4de\` (\`usersId\`), INDEX \`IDX_03d649eb9da7d95e584e881ff2\` (\`citiesId\`), PRIMARY KEY (\`usersId\`, \`citiesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users_cities_cities\` ADD CONSTRAINT \`FK_b9593b403ceffb58faab1cd4dea\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_cities_cities\` ADD CONSTRAINT \`FK_03d649eb9da7d95e584e881ff29\` FOREIGN KEY (\`citiesId\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_cities_cities\` DROP FOREIGN KEY \`FK_03d649eb9da7d95e584e881ff29\``);
        await queryRunner.query(`ALTER TABLE \`users_cities_cities\` DROP FOREIGN KEY \`FK_b9593b403ceffb58faab1cd4dea\``);
        await queryRunner.query(`DROP INDEX \`IDX_03d649eb9da7d95e584e881ff2\` ON \`users_cities_cities\``);
        await queryRunner.query(`DROP INDEX \`IDX_b9593b403ceffb58faab1cd4de\` ON \`users_cities_cities\``);
        await queryRunner.query(`DROP TABLE \`users_cities_cities\``);
    }

}
