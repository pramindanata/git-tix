const SIGNIN_KEY = 'SIGNIN';

export class AuthService {
  static enableStatus(): void {
    localStorage.setItem(SIGNIN_KEY, 'true');
  }

  static disableStatus(): void {
    localStorage.removeItem(SIGNIN_KEY);
  }

  static getStatus(): boolean {
    return localStorage.getItem(SIGNIN_KEY) === 'true';
  }
}
