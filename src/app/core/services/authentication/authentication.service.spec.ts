import {AuthenticationService} from "./authentication.service";
import {of} from "rxjs";
import {environment} from "../../../../environments/environment";

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

  const httpClient: any = {
    head: jest.fn()
  };
  const router: any = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    window.sessionStorage.setItem('auth', 'test');

    service = new AuthenticationService(httpClient, router);
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

  it('should login', done => {
    service.loggedIn = false

    httpClient.head.mockReturnValueOnce(of({}));

    service.login('pass').subscribe(() => {
      expect(service.loggedIn).toEqual(true);
      expect(httpClient.head).toHaveBeenCalledWith(environment.apiURL + 'login', expect.anything());
      done();
    });
  });
});
