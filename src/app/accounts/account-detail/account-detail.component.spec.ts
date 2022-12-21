import {of} from 'rxjs';
import {AccountDetailComponent} from './account-detail.component';
import {Account, AccountType} from '../model/account';

describe('AccountDetailComponent', () => {
  let component: AccountDetailComponent;

  const account = new Account('account 1', AccountType.CHECKINGS, 150, false);

  const accountService: any = {
    save: jest.fn(),
    fetch: jest.fn()
  };
  const router: any = {
    navigate: jest.fn()
  };
  const notificationService: any = {
    notify: jest.fn()
  };
  const route: any = {
    'snapshot': {
      'params': {'id': '1'}
    }
  };

  beforeEach(() => {
    component = new AccountDetailComponent(route, accountService, router, notificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init correctly with an account id', async () => {
    accountService.fetch.mockReturnValueOnce(of(account));

    await component.ngOnInit();

    expect(accountService.fetch).toHaveBeenCalled();
    expect(component.edit).toBeTruthy();
  });

  it('should create a new account on submit', async () => {
    component.accountForm.get('name')!.setValue('name1');
    component.accountForm.get('amount')!.setValue('300');
    component.accountForm.get('type')!.setValue('CHECKINGS');

    accountService.save.mockReturnValueOnce(of(account));

    await component.onSubmit();

    expect(accountService.save).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalled();
  });
});
