import {of} from 'rxjs';
import {Account, AccountType} from '../model/account';
import {AccountListComponent} from './account-list.component';

describe('AccountListComponent', () => {
  let component: AccountListComponent;

  const account = new Account('account 1', AccountType.CHECKINGS, 150, false);

  const accountService: any = {
    list: jest.fn(),
    add: jest.fn(),
    delete: jest.fn(),
    save: jest.fn()
  };
  const notificationService: any = {
    openSnackBar: jest.fn()
  };
  const matDialog: any = {
    open: jest.fn()
  };

  beforeEach(() => {
    component = new AccountListComponent(accountService, matDialog, notificationService);

    accountService.delete.mockClear();
    notificationService.openSnackBar.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.accounts).toBeDefined();
  });

  it('should init', () => {
    accountService.list.mockReturnValueOnce(of([account]));

    component.ngOnInit();

    expect(accountService.list).toHaveBeenCalled();
    expect(component.accounts).toEqual([account]);
  });

  it('should determine the total amount', () => {
    component.accounts = [account];

    const total = component.determineTotals();

    expect(total).toEqual(150);
  });

  it('should delete an account after confirmation', async () => {
    const account = new Account('account 1', AccountType.CHECKINGS, 150, false, 1);

    const dialog = new class {
      afterClosed() {
        return of(true);
      }
    };

    matDialog.open.mockReturnValueOnce(dialog);
    accountService.delete.mockReturnValueOnce(of(account));

    await component.onDelete(account);

    expect(matDialog.open).toHaveBeenCalled();
    expect(accountService.delete).toHaveBeenCalled();
    expect(notificationService.openSnackBar).toHaveBeenCalled();
  });

  it('should not delete an account after rejection', async () => {
    const dialog = new class {
      afterClosed() {
        return of(false);
      }
    };

    matDialog.open.mockReturnValueOnce(dialog);
    accountService.delete.mockReturnValueOnce(Promise.resolve());

    await component.onDelete(account);

    expect(matDialog.open).toHaveBeenCalled();
    expect(accountService.delete).not.toHaveBeenCalled();
    expect(notificationService.openSnackBar).not.toHaveBeenCalled();
  });

  it('should star an account', async () => {
    component.accounts = [account];

    accountService.save.mockReturnValueOnce(of(account));

    await component.onStar(account);

    expect(accountService.save).toHaveBeenCalledWith(account);
    expect(notificationService.openSnackBar).toHaveBeenCalled();
    expect(account.starred).toEqual(true);
  });
});
