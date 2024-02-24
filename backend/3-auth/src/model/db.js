import pg from 'pg';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { config } from '../config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

const pool = new pg.Pool({
  host: `${config.DATABASE_HOST}`,
  user: `${config.DATABASE_USER}`,
  password: `${config.DATABASE_PASSWORD}`,
  port: `${config.DATABASE_PORT}`,
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

const createTableText = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profilePublicId VARCHAR(255) NOT NULL,
  profilePicture VARCHAR(255),
  emailVerified BOOLEAN NOT NULL DEFAULT FALSE,
  emailVerificationToken VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_index ON users(email);
CREATE INDEX IF NOT EXISTS users_username_index ON users(username);
CREATE INDEX IF NOT EXISTS users_emailVerificationToken_index ON users(emailVerificationToken);
`;

const databaseConnection = async () => {
  try {
    await pool.connect();
    log.info('Auth service successfully connected to postgresql database.');
    await pool.query(createTableText);
  } catch (error) {
    log.error('AuthService - Unable to connect to database');
    log.log('error', 'AuthService databaseConnection() method error:', error);
  }
};

export { databaseConnection, pool };
