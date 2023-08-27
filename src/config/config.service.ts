import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';
import * as path from 'path';
import IEnvConfigInterface from '../interfaces/env-config.interface';
import { Injectable } from '@nestjs/common';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class ConfigService {
  private envConfig: IEnvConfigInterface;

  constructor(filePath: string) {
    const config = fs.existsSync(filePath)
      ? dotenv.parse(fs.readFileSync(filePath))
      : process.env;
    this.envConfig = this.validateInput(config);
  }

  getTypeORMConfig(): MysqlConnectionOptions {
    const baseDir = path.join(__dirname, '../');
    const entitiesPath = `${baseDir}${this.envConfig.TYPEORM_ENTITIES.split(
      '/',
    ).join(path.sep)}`;
    const migrationsPath = `${baseDir}${this.envConfig.TYPEORM_MIGRATIONS.split(
      '/',
    ).join(path.sep)}`;
    const type: any = this.envConfig.TYPEORM_CONNECTION;

    return {
      type,
      host: this.envConfig.TYPEORM_HOST,
      username: this.envConfig.TYPEORM_USERNAME,
      password: this.envConfig.TYPEORM_PASSWORD,
      database: this.envConfig.TYPEORM_DATABASE,
      port: Number.parseInt(this.envConfig.TYPEORM_PORT, 10),
      logging: false,
      entities: [entitiesPath],
      migrations: [migrationsPath],
      migrationsRun: this.envConfig.TYPEORM_MIGRATIONS_RUN === 'true',
      timezone: '+00:00',
      extra: {
        connectionLimit: 5,
      },
    };
  }

  /*
	  Ensures all needed variables are set, and returns the validated JavaScript object
	  including the applied default values.
  */
  private validateInput(envConfig: IEnvConfigInterface): IEnvConfigInterface {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production')
        .default('development'),
    }).unknown(true);

    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
