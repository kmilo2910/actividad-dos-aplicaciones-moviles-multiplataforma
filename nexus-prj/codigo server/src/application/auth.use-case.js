export class AuthUseCase {
  constructor(authPort) {
    this.authPort = authPort;
  }
  loginWithGoogle() {
    return this.authPort.loginWithGoogle();
  }
  getCurrentUser() {
    return this.authPort.getCurrentUser();
  }
  getIdToken() {
    return this.authPort.getIdToken();
  }
}
