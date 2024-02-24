import { authService } from '../../services/api/auth.service.js';

export class SignOut {
  async update(req, res) {
    const response = await authService.signOut(req.body);
    req.session = { jwt: response.data.token };
    res.status(200).json({ message: response.data.message, user: response.data.user });
  }
}
