import * as dotenv from 'dotenv';
import { dotEnvOptions } from './config/dotenv-options';

// Make sure dbConfig is imported only after dotenv.config

dotenv.config(dotEnvOptions);

import config from './config/database.config';

export default config;