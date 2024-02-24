import crypto from 'crypto';
import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { upload } from '@rulerchen/tasker-shared-library';
import { getUserByUsernameOrEmail, createAuthUser, signToken } from '../services/auth.service.js';
import { publishDirectMessage } from '../queues/auth.producer.js';
import { authChannel } from '../server.js';
import { config } from '../config.js';

const saltRounds = 10;

export async function create(req, res) {
  const { username, email, password, profilePicture } = req.body;
  const checkIfUserExist = await getUserByUsernameOrEmail(username, email);
  if (checkIfUserExist) {
    throw new Error('Invalid credentials. Email or Username', 'SignUp create() method error');
  }

  const profilePublicId = uuidV4();
  const uploadResult = await upload(profilePicture, `${profilePublicId}`, true, true);
  if (!uploadResult.public_id) {
    throw new Error('File upload error. Try again', 'SignUp create() method error');
  }

  const randomBytes = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters = randomBytes.toString('hex');
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const authData = {
    username,
    email,
    profilePublicId,
    password: hashedPassword,
    profilePicture: uploadResult?.secure_url,
    emailVerificationToken: randomCharacters,
  };
  const result = await createAuthUser(authData);

  const message = {
    receiverEmail: result.email,
    verifyLink: `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`,
    template: 'verifyEmail',
  };
  await publishDirectMessage(
    authChannel,
    'tasker-email-notifications',
    'auth-email',
    JSON.stringify(message),
    'Verify email message has been sent to notification service.',
  );

  const userJWT = signToken(result.id, result.email, result.username);
  res.status(201).json({ message: 'User created successfully', user: result, token: userJWT });
}
