import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import pg from 'pg';
import { config } from '../config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

const pool = new pg.Pool({
  host: `${config.DATABASE_HOST}`,
  user: `${config.DATABASE_USER}`,
  password: `${config.DATABASE_PASSWORD}`,
  port: 5432,
  database: `${config.DATABASE_NAME}`,
  ...(config.NODE_ENV !== 'development' &&
    config.CLUSTER_TYPE === 'AWS' && {
      ssl: {
        rejectUnauthorized: false,
      },
    }),
});

pool.on('error', (error) => {
  log.log('error', 'pg client error', error);
  process.exit(-1);
});

const createTableText = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '/table.sql'), 'utf8');

const databaseConnection = async () => {
  try {
    await pool.connect();
    log.info('Review service successfully connected to postgresql database.');
    await pool.query(createTableText);
  } catch (error) {
    log.error('AuthService - Unable to connect to database');
    log.log('error', 'AuthService databaseConnection() method error:', error);
  }
};

export { databaseConnection, pool };
