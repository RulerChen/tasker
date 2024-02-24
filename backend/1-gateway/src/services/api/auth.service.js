import { AxiosService } from '../axios.js';
import { config } from '../../config.js';

export let axiosAuthInstance;

class AuthService {
  constructor() {
    this.axiosService = new AxiosService(`${config.AUTH_BASE_URL}/api/${config.API_VERSION}/auth`, 'auth');
    axiosAuthInstance = this.axiosService.axios;
  }

  async getCurrentUser() {
    const response = await axiosAuthInstance.get('/currentuser');
    return response;
  }

  async getRefreshToken(username) {
    const response = await axiosAuthInstance.get(`/refresh-token/${username}`);
    return response;
  }

  async verifyEmail(token) {
    const response = await axiosAuthInstance.put('/verify-email', { token });
    return response;
  }

  async resendEmail(data) {
    const response = await axiosAuthInstance.post('/resend-email', data);
    return response;
  }

  async signUp(body) {
    const response = await this.axiosService.axios.post('/signup', body);
    return response;
  }

  async signIn(body) {
    const response = await this.axiosService.axios.post('/signin', body);
    return response;
  }
}

export const authService = new AuthService();
