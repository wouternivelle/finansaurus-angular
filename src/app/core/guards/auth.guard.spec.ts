import {AuthGuard} from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const router: any = {
    navigate: jest.fn()
  };

  const authService: any = {
    isLoggedIn: jest.fn()
  };

  beforeEach(() => {
    guard = new AuthGuard(router, authService);
  });

  it('create an instance', () => {
    expect(guard).toBeTruthy();
  });

  it('returns false if not logged in', () => {
    authService.isLoggedIn.mockReturnValueOnce(false);

    const result = guard.canActivate();

    expect(router.navigate).toHaveBeenCalledWith(['auth/login']);
    expect(result).toBe(false);
  });

  it('returns true if logged in', () => {
    authService.isLoggedIn.mockReturnValueOnce(true);

    const result = guard.canActivate();

    expect(result).toBe(true);
  });
});
