import {of} from 'rxjs';
import {TransactionListComponent} from './transaction-list.component';
import {Payee} from '../../payees/model/payee';
import {Account, AccountType} from "../../accounts/model/account";
import {Category, CategoryType} from "../../categories/model/category";
import {Transaction, TransactionType} from "../model/transaction";
import {TransactionsPage} from "../model/transactions.page";
import {PageEvent} from "@angular/material/paginator";

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;

  const transactionService: any = {
    list: jest.fn(),
    delete: jest.fn()
  };
  const payeeService: any = {
    list: jest.fn(),
  };
  const accountService: any = {
    list: jest.fn(),
  };
  const categoryService: any = {
    list: jest.fn(),
  };
  const matDialog: any = {
    open: jest.fn()
  };
  const notificationService: any = {
    notify: jest.fn()
  };
  const route: any = {
    'snapshot': {
      'queryParams': {'accountId': '1'}
    }
  };

  const sessionStorageMock = (() => {
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
    value: sessionStorageMock
  });

  const payee = new Payee('payee 1', 1);
  const account = new Account('account 1', AccountType.CHECKINGS, 150, false, 1);
  const category = new Category('category 1', CategoryType.GENERAL, false, false, 1, null);
  const transaction = new Transaction(30.25, TransactionType.OUT, new Date(), 'payee 1', 1, 1, 1, 'test');

  beforeEach(() => {
    component = new TransactionListComponent(transactionService, route, categoryService, payeeService, accountService, matDialog, notificationService);

    notificationService.notify.mockClear();
    transactionService.delete.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', async () => {
    window.sessionStorage.setItem('transaction-pagination', '30');

    payeeService.list.mockReturnValueOnce(of([payee]));
    accountService.list.mockReturnValueOnce(of([account]));
    categoryService.list.mockReturnValueOnce(of([category]));
    transactionService.list.mockReturnValueOnce(of(new TransactionsPage([transaction], 0, 0, 0, 0)));

    await component.ngOnInit();

    expect(payeeService.list).toHaveBeenCalled();
    expect(accountService.list).toHaveBeenCalled();
    expect(categoryService.list).toHaveBeenCalled();
    expect(transactionService.list).toHaveBeenCalledWith(0, 30);

    expect(component.transactions).toEqual([transaction]);
  });

  it('should delete a transaction after confirmation', async () => {
    const dialog = new class {
      afterClosed() {
        return of(true);
      }
    };

    matDialog.open.mockReturnValueOnce(dialog);
    transactionService.delete.mockReturnValueOnce(of(1));

    await component.onDelete(transaction);

    expect(matDialog.open).toHaveBeenCalled();
    expect(transactionService.delete).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalled();
    expect(transactionService.list).toHaveBeenCalled();
  });

  it('should not delete a transaction after rejection', async () => {
    const dialog = new class {
      afterClosed() {
        return of(false);
      }
    };

    matDialog.open.mockReturnValueOnce(dialog);
    transactionService.delete.mockReturnValueOnce(of(1));

    await component.onDelete(transaction);

    expect(matDialog.open).toHaveBeenCalled();
    expect(transactionService.delete).not.toHaveBeenCalled();
    expect(notificationService.notify).not.toHaveBeenCalled();
  });

  it('should handle page events', async () => {
    transactionService.list.mockReturnValueOnce(of(new TransactionsPage([transaction], 2, 25, 0, 0)));

    const pageEvent = new PageEvent();
    pageEvent.pageSize = 25;
    pageEvent.pageIndex = 2;
    await component.onPage(pageEvent);

    expect(transactionService.list).toHaveBeenCalledWith(2, 25);

    expect(component.pageSize).toEqual(25);
    expect(component.pageIndex).toEqual(2);
  });
});
