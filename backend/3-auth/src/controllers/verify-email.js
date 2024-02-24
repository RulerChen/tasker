import { getAuthUserByVerificationToken, updateVerifyEmailField, getUserById } from '../services/auth.service.js';

export async function update(req, res) {
  const { token } = req.body;

  const checkIfUserExist = await getAuthUserByVerificationToken(token);
  if (!checkIfUserExist) {
    throw new Error('Verification token is either invalid or is already used.', 'VerifyEmail update() method error');
  }

  await updateVerifyEmailField(checkIfUserExist.id, true, '');
  const updatedUser = await getUserById(checkIfUserExist.id);
  res.status(200).json({ message: 'Email verified successfully.', user: updatedUser });
}
