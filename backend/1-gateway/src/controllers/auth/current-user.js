import { authService } from '../../services/api/auth.service.js';
export class CurrentUser {
  async read(req, res) {
    const response = await authService.getCurrentUser();
    res.status(200).json({ message: response.data.message, user: response.data.user });
  }
}
