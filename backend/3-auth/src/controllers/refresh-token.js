import { getUserByUsername, signToken } from '../services/auth.service.js';

export async function token(req, res) {
  const existingUser = await getUserByUsername(req.params.username);
  const userJWT = signToken(existingUser.id, existingUser.email, existingUser.username);
  res.status(200).json({ message: 'Refresh token', user: existingUser, token: userJWT });
}
