import {of} from 'rxjs';
import {TransactionListComponent} from './transaction-list.component';
import {Payee} from '../../payees/model/payee';
import {Account, AccountType} from "../../accounts/model/account";
import {Category, CategoryType} from "../../categories/model/category";
import {Transaction, TransactionType} from "../model/transaction";

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
    openSnackBar: jest.fn()
  };
  const route: any = {
    'snapshot': {
      'queryParams': {'accountId': '1'}
    }
  };
  const payee = new Payee('payee 1', 1);
  const account = new Account('account 1', AccountType.CHECKINGS, 150, false, 1);
  const category = new Category('category 1', CategoryType.GENERAL, false, false, 1, null);
  const transaction = new Transaction(30.25, TransactionType.OUT, new Date(), 'payee 1', 1, 1, 1, 'test');

  beforeEach(() => {
    component = new TransactionListComponent(transactionService, route, categoryService, payeeService, accountService, matDialog, notificationService);

    notificationService.openSnackBar.mockClear();
    transactionService.delete.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', async () => {
    payeeService.list.mockReturnValueOnce(of([payee]));
    accountService.list.mockReturnValueOnce(of([account]));
    categoryService.list.mockReturnValueOnce(of([category]));
    transactionService.list.mockReturnValueOnce(of([transaction]));

    await component.ngOnInit();

    expect(payeeService.list).toHaveBeenCalled();
    expect(accountService.list).toHaveBeenCalled();
    expect(categoryService.list).toHaveBeenCalled();
    expect(transactionService.list).toHaveBeenCalled();

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
    expect(notificationService.openSnackBar).toHaveBeenCalled();
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
    expect(notificationService.openSnackBar).not.toHaveBeenCalled();
  });
});
