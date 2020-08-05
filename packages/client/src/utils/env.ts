export class EnvService {
  static isInServer(): boolean {
    return typeof window === 'undefined';
  }

  static isInClient(): boolean {
    return !EnvService.isInServer();
  }
}
