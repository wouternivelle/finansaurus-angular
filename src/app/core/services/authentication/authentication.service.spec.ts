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

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  const fireAuth: any = {
    signInWithPopup: jest.fn()
  };
  const logger: any = {
    log: jest.fn(),
    error: jest.fn()
  };
  const router: any = {
    navigate: jest.fn()
  };
  const user: any = {
    user: {
      getIdToken: jest.fn()
    }
  }

  beforeEach(() => {
    window.sessionStorage.setItem('auth', 'test');

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

    fireAuth.signInWithPopup.mockReturnValueOnce(Promise.resolve(user));
    user.user.getIdToken.mockReturnValueOnce(Promise.resolve('token'));

    service.loginWithGoogle().then(() => {
      expect(service.loggedIn).toEqual(true);
      expect(fireAuth.signInWithPopup).toHaveBeenCalled();
      expect(user.user.getIdToken).toHaveBeenCalled();
      done();
    });
  });
});
