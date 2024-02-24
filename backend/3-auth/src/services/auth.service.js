import { winstonLogger } from '@rulerchen/tasker-shared-library';
import jwt from 'jsonwebtoken';
import { pool } from '../model/db.js';
import { publishDirectMessage } from '../queues/auth.producer.js';
import { authChannel } from '../server.js';
import { config } from '../config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authService', 'debug');

export async function createAuthUser(data) {
  try {
    const { email, username, password, profilePublicId, profilePicture, emailVerificationToken } = data;
    const query = `
    INSERT INTO users (email, username, password, profilePublicId, profilePicture, emailVerificationToken)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `;
    const values = [email, username, password, profilePublicId, profilePicture, emailVerificationToken];
    const result = await pool.query(query, values);
    const message = {
      ...result.rows[0],
      type: 'auth',
    };
    await publishDirectMessage(authChannel, 'auth', 'auth.user.created', JSON.stringify(message), 'User created message published');
    const user = { ...result.rows[0], password: undefined };
    return user;
  } catch (error) {
    log.log('error', 'AuthService createAuthUser() method error:', error);
  }
}

export async function getUserById(authId) {
  try {
    const query = `
    SELECT * FROM users
    WHERE id = $1
    `;
    const values = [authId];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return user;
  } catch (error) {
    log.log('error', 'AuthService getUserById() method error:', error);
  }
}

export async function getUserByUsernameOrEmail(username, email) {
  try {
    const query = `
    SELECT * FROM users
    WHERE username = $1 OR email = $2
    `;
    const values = [username, email];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return user;
  } catch (error) {
    log.log('error', 'AuthService getUserByUsernameOrEmail() method error:', error);
  }
}

export async function getUserByEmail(email) {
  try {
    const query = `
    SELECT * FROM users
    WHERE email = $1
    `;
    const values = [email];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return user;
  } catch (error) {
    log.log('error', 'AuthService getUserByEmail() method error:', error);
  }
}

export async function getUserByUsername(username) {
  try {
    const query = `
    SELECT * FROM users
    WHERE username = $1
    `;
    const values = [username];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return user;
  } catch (error) {
    log.log('error', 'AuthService getUserByUsername() method error:', error);
  }
}

export async function getAuthUserByVerificationToken(token) {
  try {
    const query = `
    SELECT * FROM users
    WHERE emailVerificationToken = $1
    `;
    const values = [token];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return user;
  } catch (error) {
    log.log('error', 'AuthService getAuthUserByVerificationToken() method error:', error);
  }
}

export async function updateVerifyEmailField(authId, emailVerified, emailVerificationToken) {
  try {
    const query = `
    UPDATE users
    SET emailVerified = $1, emailVerificationToken = $2
    WHERE id = $3
    RETURNING *
    `;
    const values = [emailVerified, emailVerificationToken, authId];
    await pool.query(query, values);
  } catch (error) {
    log.log('error', 'AuthService updateVerifyEmailField() method error:', error);
  }
}

export function signToken(id, email, username) {
  return jwt.sign(
    {
      id,
      email,
      username,
    },
    config.JWT_TOKEN,
  );
}
