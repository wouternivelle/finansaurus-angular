import {of} from 'rxjs';
import {Balance, BalanceCategory} from '../model/balance';
import {BalanceDetailComponent} from './balance-detail.component';
import {Category, CategoryType} from '../../categories/model/category';
import {Transaction, TransactionType} from '../../transactions/model/transaction';

describe('BalanceDetailComponent', () => {
  let component: BalanceDetailComponent;

  const balanceService: any = {
    updateBudget: jest.fn(),
    fetchForDate: jest.fn(),
    save: jest.fn(),
    usePreviousMonthValues: jest.fn()
  };
  const notificationService: any = {
    notify: jest.fn()
  };
  const transactionService: any = {
    listIncomingTransactionsForBalance: jest.fn(),
    listTransactionsForMonthAndCategory: jest.fn()
  };
  const categoryService: any = {
    listWithoutSystem: jest.fn(),
  };
  const dialog: any = {
    open: jest.fn()
  };

  const balance = new Balance(10, 2023, 0, 100, []);
  const parent = new Category('parent', CategoryType.GENERAL, false, false, 1, null);
  const child = new Category('child', CategoryType.GENERAL, false, false, 2, 1);

  beforeEach(() => {
    component = new BalanceDetailComponent(balanceService, notificationService, categoryService, transactionService, dialog);

    notificationService.notify.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    balance.categories = [new BalanceCategory(1, 30, 0, 30), new BalanceCategory(3, 70, 0, 70)];
    balance.incoming = 300;

    const parent = new Category('parent', CategoryType.GENERAL, false, false, 1, null);
    const child = new Category('child', CategoryType.GENERAL, false, false, 2, 1);
    categoryService.listWithoutSystem.mockReturnValueOnce(of([child, parent]));

    const incomingTransaction = new Transaction(30.25, TransactionType.IN, new Date(), 'payee 1', 1, 1, 1, 'test');
    transactionService.listIncomingTransactionsForBalance.mockReturnValueOnce(of([incomingTransaction]));

    component.balanceLoaded = of(balance);

    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(component.balance).toEqual(balance);
    expect(component.budgeted).toEqual(100);
    expect(component.date.getFullYear()).toEqual(balance.year);
    expect(component.date.getMonth()).toEqual(balance.month);
    expect(component.generalCategories).toEqual([parent, child]);
    expect(transactionService.listIncomingTransactionsForBalance).toHaveBeenCalledWith(11, 2023);
    expect(component.incomingNextMonth).toEqual(30.25);
  });

  it('should enter a budget for a category', async () => {
    component.balance = balance;
    component.categories = [parent, child];

    balanceService.updateBudget.mockReturnValueOnce(of(balance));

    const event = {target: {value: '123'}} as any;
    await component.onBudgetCategoryEnter(2, event, 'child');

    expect(component).toBeTruthy();
    expect(balanceService.updateBudget).toHaveBeenCalledWith(balance, 2, 123, [1, 2]);
    expect(notificationService.notify).toHaveBeenCalled();
  });

  it('should determine the balance for a category', () => {
    component.balance = balance;
    const balanceCategory = new BalanceCategory(1, 50, 10, 40);
    balanceCategory.balance = 40;
    component.balance.categories = [balanceCategory];

    const result: number = component.determineBalanceForCategory(1);

    expect(result).toBe(40);
  });
  it('should return 0 when determining the balance for a category', () => {
    const result = component.determineBalanceForCategory(1);

    expect(result).toBe(0);
  });

  it('should replace the budgeted values of the current balance with the previous balance', async () => {
    component.balance = balance;
    balanceService.usePreviousMonthValues.mockReturnValueOnce(of(balance));

    await component.onUsePreviousValues();

    expect(balanceService.usePreviousMonthValues).toHaveBeenCalledWith(balance);
  });

  it('should determine the total budgeted amount for a balance', () => {
    component.balance = balance;
    const balanceCategory = new BalanceCategory(1, 50, 10, 40);
    const balanceCategory2 = new BalanceCategory(2, 100, 20, 80);
    const balanceCategory3 = new BalanceCategory(3, 150, 30, 120);
    component.balance.categories = [balanceCategory, balanceCategory2, balanceCategory3];

    const result = component.determineTotalBudgeted();

    expect(result).toBe(300);
  });

  it('should return 0 when determining the total budgeted amount', () => {
    const result = component.determineTotalBudgeted();

    expect(result).toBe(0);
  });

  it('should determine the total operations amount for a balance', () => {
    component.balance = balance;
    const balanceCategory = new BalanceCategory(1, 50, 10, 40);
    const balanceCategory2 = new BalanceCategory(2, 100, 20, 80);
    const balanceCategory3 = new BalanceCategory(3, 150, 30, 120);
    component.balance.categories = [balanceCategory, balanceCategory2, balanceCategory3];

    const result: number = component.determineTotalOperations();

    expect(result).toBe(60);
  });

  it('should return 0 when determining the total operations for a balance', () => {
    const result = component.determineTotalOperations();

    expect(result).toBe(0);
  });

  it('should determine the total balance amount for a balance', () => {
    component.balance = balance;
    const balanceCategory = new BalanceCategory(1, 50, 10, 40);
    const balanceCategory2 = new BalanceCategory(2, 100, 20, 80);
    const balanceCategory3 = new BalanceCategory(3, 150, 30, 120);
    component.balance.categories = [balanceCategory, balanceCategory2, balanceCategory3];

    const result = component.determineTotalBalance();

    expect(result).toBe(240);
  });

  it('should return 0 when determining the total balance amount for a balance', () => {
    const result = component.determineTotalBalance();

    expect(result).toBe(0);
  });

  it('should load the incoming transactions and show the dialog', async () => {
    const transaction = new Transaction(30.25, TransactionType.OUT, new Date(), 'payee 1', 1, 1, 1, 'test');

    component.balance = balance;

    transactionService.listIncomingTransactionsForBalance.mockReturnValue(of([transaction, transaction]));

    await component.loadIncomingTransactions();

    expect(component).toBeTruthy();
    expect(transactionService.listIncomingTransactionsForBalance).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should load the transactions for a month and category and show the dialog', async () => {
    const transaction = new Transaction(30.25, TransactionType.OUT, new Date(), 'payee 1', 1, 1, 1, 'test');

    component.balance = balance;

    transactionService.listTransactionsForMonthAndCategory.mockReturnValue(of([transaction, transaction]));

    await component.loadTransactions(1);

    expect(component).toBeTruthy();
    expect(transactionService.listTransactionsForMonthAndCategory).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should find an existing category in the balance', () => {
    balance.categories = [new BalanceCategory(1, 1, 0, 0), new BalanceCategory(2, 2, 0, 0)];

    const category: BalanceCategory = component.findCategory(balance, 2);

    expect(category.categoryId).toBe(2);
    expect(category.budgeted).toBe(2);
  });

  it('should create a new category in the balance if none exists', () => {
    balance.categories = [new BalanceCategory(1, 1, 0, 0), new BalanceCategory(2, 2, 0, 0)];

    const category: BalanceCategory = component.findCategory(balance, 3);

    expect(category.categoryId).toBe(3);
    expect(category.budgeted).toBe(0);
  });
});
