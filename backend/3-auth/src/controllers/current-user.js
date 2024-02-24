import { getUserById } from '../services/auth.service.js';

export async function read(req, res) {
  let user = null;
  const existingUser = await getUserById(req.currentUser.id);
  if (Object.keys(existingUser).length) {
    user = existingUser;
  }
  res.status(200).json({ message: 'Authenticated user', user });
}
