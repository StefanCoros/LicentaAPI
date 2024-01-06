import * as path from 'path';

const baseDir = path.join(__dirname, '..', '../');
const entitiesPath = `${baseDir}${(process?.env?.TYPEORM_ENTITIES || '')
  .split('/')
  .join(path.sep)}`;
const migrationsPath = `${baseDir}${(process?.env?.TYPEORM_MIGRATIONS || '')
  .split('/')
  .join(path.sep)}`;
const seedsPath = `${baseDir}${(process?.env?.TYPEORM_SEEDS || '')
  .split('/')
  .join(path.sep)}`;
const factoriesPath = `${baseDir}${(process?.env?.TYPEORM_FACTORIES || '')
  .split('/')
  .join(path.sep)}`;

export default {
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number.parseInt(process?.env?.TYPEORM_PORT || '', 10),
  logging: true,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  seeds: [seedsPath],
  factories: [factoriesPath],
  // 1. timezone: 'UTC' - no need to pass the timezone option for cli
  // 2. try adding timezone like this
  timezone: '+00:00',
};
