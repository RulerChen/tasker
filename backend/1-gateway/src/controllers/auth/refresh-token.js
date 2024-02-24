import { authService } from '../../services/api/auth.service.js';

export class Refresh {
  async token(req, res) {
    const response = await authService.getRefreshToken(req.params.username);
    req.session = { jwt: response.data.token };
    res.status(200).json({ message: response.data.message, user: response.data.user });
  }
}
