import {AuthenticationService} from "./authentication.service";

const localStorageMock = (() => {
  let store = {};

  return {
    getItem(key: string | number) {
      // @ts-ignore
      return store[key] || null;
    },
    setItem(key: string | number, value: { toString: () => any; }) {
      // @ts-ignore
      store[key] = value.toString();
    },
    removeItem(key: string | number) {
      // @ts-ignore
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  const fireAuth: any = {
    signInWithPopup: jest.fn(),
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn()
  };
  const logger: any = {
    log: jest.fn(),
    error: jest.fn()
  };
  const router: any = {
    navigate: jest.fn()
  };
  const user: any = {
    getIdToken: jest.fn()
  };
  const userCredential: any = {
    user: user
  };

  beforeEach(() => {
    window.localStorage.setItem('auth', 'test');

    service = new AuthenticationService(router, fireAuth, logger);
  });

  it('should be created with logged in status', () => {
    expect(service).toBeTruthy();
    expect(service.loggedIn).toEqual(true);
  });

  it('should check login', () => {
    service.loggedIn = true;

    expect(service.isLoggedIn()).toEqual(true);
  });

  it('should logout', () => {
    service.loggedIn = true;

    service.logout();

    expect(service.loggedIn).toEqual(false);
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should login with google', done => {
    service.loggedIn = false

    fireAuth.signInWithPopup.mockReturnValueOnce(Promise.resolve(userCredential));
    userCredential.user.getIdToken.mockReturnValueOnce(Promise.resolve('token'));

    service.loginWithGoogle().then(() => {
      expect(service.loggedIn).toEqual(true);
      expect(fireAuth.signInWithPopup).toHaveBeenCalled();
      expect(userCredential.user.getIdToken).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
      done();
    });
  });

  it('should log an error when logging in with google', done => {
    service.loggedIn = false

    fireAuth.signInWithPopup.mockReturnValueOnce(Promise.reject('error'));

    service.loginWithGoogle().then(() => {
      expect(service.loggedIn).toEqual(false);
      expect(logger.error).toHaveBeenCalled();
      done();
    });
  });

  it('should log an error when getting a token', done => {
    service.loggedIn = false

    fireAuth.signInWithPopup.mockReturnValueOnce(Promise.resolve(userCredential));
    userCredential.user.getIdToken.mockReturnValueOnce(Promise.reject());

    service.loginWithGoogle().then(() => {
      expect(service.loggedIn).toEqual(false);
      expect(logger.error).toHaveBeenCalled();
      done();
    });
  });
});
