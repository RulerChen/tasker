import { jest } from '@jest/globals';

export const authMockRequest = (sessionData, body, currentUser, params) => ({
  session: sessionData,
  body,
  params,
  currentUser,
});

export const authMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export const authUserPayload = {
  id: 1,
  username: 'Manny',
  email: 'manny@test.com',
  iat: 1235282483,
};

export const authMock = {
  id: 1,
  profilePublicId: '123428712838478382',
  username: 'Manny',
  email: 'manny@test.com',
  profilePicture: '',
  emailVerified: true,
  createdAt: '2023-12-19T07:42:24.431Z',
};
