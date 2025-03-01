import {of} from 'rxjs';
import {TransactionDetailComponent} from './transaction-detail.component';
import {Category, CategoryType} from '../../categories/model/category';
import {Payee} from '../../payees/model/payee';
import {Account, AccountType} from '../../accounts/model/account';
import {Transaction, TransactionType} from '../model/transaction';
import moment from "moment";

describe('TransactionDetailComponent', () => {
  let component: TransactionDetailComponent;

  const transactionService: any = {
    save: jest.fn(),
    fetch: jest.fn(),
  };
  const categoryService: any = {
    list: jest.fn()
  };
  const accountService: any = {
    list: jest.fn(),
  };
  const payeeService: any = {
    list: jest.fn(),
    add: jest.fn()
  };
  const router: any = {
    navigate: jest.fn()
  };
  const notificationService: any = {
    notify: jest.fn()
  };
  const route: any = {
    'snapshot': {
      'params': {'id': 1}
    }
  };
  const payee = new Payee('payee 1', 1, 1);
  const account = new Account('account 1', AccountType.CHECKINGS, 150, false, 1);
  const category = new Category('category 1', CategoryType.GENERAL, false, false, 1, 0);
  const transaction = new Transaction(30.25, TransactionType.OUT, new Date(), 'payee 1', 1, 1, 1, 'test');

  beforeEach(() => {
    component = new TransactionDetailComponent(categoryService, accountService,
      payeeService, transactionService, notificationService, route, router);

    transactionService.save.mockClear();
    transactionService.fetch.mockClear();
    notificationService.notify.mockClear();
    router.navigate.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init correctly', async () => {
    const starredAccount = new Account('account 2', AccountType.CHECKINGS, 300, true, 1);
    const accounts = [account, starredAccount];
    const date = new Date();
    transaction.date = date;
    transaction.payeeId = 1;

    categoryService.list.mockReturnValueOnce(of([category]));
    payeeService.list.mockReturnValueOnce(of([payee]));
    accountService.list.mockReturnValueOnce(of(accounts));
    transactionService.fetch.mockReturnValueOnce(of(transaction));

    await component.ngOnInit();

    expect(categoryService.list).toHaveBeenCalled();
    expect(component.categories).toEqual([category]);
    expect(payeeService.list).toHaveBeenCalled();
    expect(component.payees).toEqual([payee]);
    expect(accountService.list).toHaveBeenCalled();
    expect(component.accounts).toEqual(accounts);
    expect(transactionService.fetch).toHaveBeenCalled();
    expect(component.transactionForm.get('payee')!.value).toEqual('payee 1');
    expect(component.transactionForm.get('account')!.value).toEqual(1);
    expect(component.transactionForm.get('amount')!.value).toEqual('30.25');
  });

  it('should init correctly for a new transaction', async () => {
    const starredAccount = new Account('account 2', AccountType.CHECKINGS, 300, true, 2);
    const accounts = [account, starredAccount];

    categoryService.list.mockReturnValueOnce(of([category]));
    payeeService.list.mockReturnValueOnce(of([payee]));
    accountService.list.mockReturnValueOnce(of(accounts));

    const route: any = {
      'snapshot': {
        'params': {'test': 1}
      }
    };
    component = new TransactionDetailComponent(categoryService, accountService,
      payeeService, transactionService, notificationService, route, router);

    await component.ngOnInit();

    expect(categoryService.list).toHaveBeenCalled();
    expect(component.categories).toEqual([category]);
    expect(payeeService.list).toHaveBeenCalled();
    expect(component.payees).toEqual([payee]);
    expect(accountService.list).toHaveBeenCalled();
    expect(component.accounts).toEqual(accounts);
    expect(transactionService.fetch).not.toHaveBeenCalled();
    expect(component.transactionForm.get('account')!.value).toEqual(2);
  });

  it('should save a transaction on submit', async () => {
    const date = new Date();
    component.payees = [payee];
    component.categories = [category];
    component.accounts = [account];
    component.transactionForm.get('payee')!.setValue('payee 1');
    component.transactionForm.get('category')!.setValue('category 1');
    component.transactionForm.get('account')!.setValue(1);
    component.transactionForm.get('amount')!.setValue('50.69');
    component.transactionForm.get('type')!.setValue(TransactionType.OUT);
    component.transactionForm.get('date')!.setValue(moment(date));

    transactionService.save.mockReturnValueOnce(of(transaction));

    await component.onSubmit();

    expect(transactionService.save).toHaveBeenCalledWith(new Transaction(50.69, TransactionType.OUT, date, 'payee 1', 1, 1, 1, ''));
    expect(notificationService.notify).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should save and prepare another on submit and another', async () => {
    const date = new Date(2022, 12, 20);
    component.payees = [payee];
    component.categories = [category];
    component.accounts = [account];
    component.transactionForm.get('payee')!.setValue('payee 1');
    component.transactionForm.get('category')!.setValue('category 1');
    component.transactionForm.get('account')!.setValue(1);
    component.transactionForm.get('amount')!.setValue('50.69');
    component.transactionForm.get('type')!.setValue(TransactionType.OUT);
    component.transactionForm.get('date')!.setValue(moment(date));

    transactionService.save.mockReturnValueOnce(of(transaction));

    await component.onSubmit(true);

    expect(transactionService.save).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.transactionForm.get('date')!.value).toEqual(moment(date));
  });

  it('should change the type of the transaction', () => {
    component.transactionForm.get('type')!.setValue(TransactionType.OUT);

    component.onChangeType(TransactionType.IN);

    expect(component.transactionForm.get('type')!.value).toEqual(TransactionType.IN);
  });

  it('should check if the type is positive or not', () => {
    component.transactionForm.get('type')!.setValue(TransactionType.OUT);

    expect(component.isPositive()).toEqual(false);
  });

  it('should filter the payees', () => {
    component.payees = [payee];

    component.transactionForm.get('payee')!.setValue('pay');

    expect(component.filteredPayees).toEqual([]);

    component.doFilterPayees();

    expect(component.filteredPayees.length).toEqual(1);
  });

  it('should filter the categories', () => {
    component.categories = [category];

    component.transactionForm.get('category')!.setValue('cat');

    expect(component.filteredCategories).toEqual([]);

    component.doFilterCategories();

    expect(component.filteredCategories.length).toEqual(1);
  });

  it('should fill in the category name when the payee has been selected', () => {
    component.categories = [category];
    component.payees = [payee];

    component.transactionForm.get('payee')!.setValue('payee 1');

    component.onPayeeSelected();

    expect(component.transactionForm.get('category')!.value).toEqual('category 1');
  });
});
