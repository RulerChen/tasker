import bcrypt from 'bcryptjs';
import { getUserByEmail, signToken } from '../services/auth.service.js';

export async function read(req, res) {
  const { email, password } = req.body;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    throw new Error('Invalid credentials', 'SignIn read() method error');
  }

  const passwordsMatch = bcrypt.compareSync(password, existingUser.password);
  if (!passwordsMatch) {
    throw new Error('Invalid credentials', 'SignIn read() method error');
  }

  const userJWT = signToken(existingUser.id, existingUser.email, existingUser.username);
  const userData = {
    ...existingUser,
    password: undefined,
  };
  res.status(200).json({ message: 'User login successfully', user: userData, token: userJWT });
}
