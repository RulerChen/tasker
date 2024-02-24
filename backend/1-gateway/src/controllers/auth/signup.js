import { authService } from '../../services/api/auth.service.js';

export class SignUp {
  async create(req, res) {
    const response = await authService.signUp(req.body);
    req.session = { jwt: response.data.token };
    res.status(201).json({ message: response.data.message, user: response.data.user });
  }
}
