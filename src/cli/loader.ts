import * as dotenv from 'dotenv';
import { dotEnvOptions } from './config/dotenv-options';

// Make sure dbConfig is imported only after dotenv.config
dotenv.config(dotEnvOptions);

import dbConfig from './config/database.config';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default new DataSource(dbConfig as MysqlConnectionOptions);