import { jest } from '@jest/globals';
// import pg from 'pg';
// import { config } from '../config.js';
import { authMock, authMockRequest, authMockResponse, authUserPayload } from './mocks/auth.mock.js';
import { read } from '../controllers/current-user.js';
import * as auth from '../services/auth.service.js';

jest.mock('@elastic/elasticsearch');
jest.mock('../services/auth.service.js');
jest.mock('../queues/auth.producer.js');

// describe('Postgres DB Connection', () => {
//   let pool;

//   beforeAll(() => {
//     pool = new pg.Pool({
//       host: `${config.DATABASE_HOST}`,
//       user: `${config.DATABASE_USER}`,
//       password: `${config.DATABASE_PASSWORD}`,
//       port: `${config.DATABASE_PORT}`,
//       database: `${config.DATABASE_NAME}`,
//     });
//   });

//   afterAll(async () => {
//     await pool.end();
//   });

//   it('should establish a successful pg db connection', async () => {
//     const client = await pool.connect();
//     expect(client).toBeTruthy();
//     client.release();
//   });
// });

describe('CurrentUser', () => {
  const USERNAME = 'Manny';
  const PASSWORD = 'manny1';

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('read method', () => {
    it('should return authenticated user', async () => {
      const req = authMockRequest({}, { username: USERNAME, password: PASSWORD }, authUserPayload);
      const res = authMockResponse();
      jest.spyOn(auth, 'getUserById').mockResolvedValue(authMock);

      await read(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authenticated user',
        user: authMock,
      });
    });

    it('should return empty user', async () => {
      const req = authMockRequest({}, { username: USERNAME, password: PASSWORD }, authUserPayload);
      const res = authMockResponse();
      jest.spyOn(auth, 'getUserById').mockResolvedValue({});

      await read(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authenticated user',
        user: null,
      });
    });
  });
});
