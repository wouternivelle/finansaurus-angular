import {BalanceTransactionDialogComponent} from './balance-transaction-dialog.component';
import {of} from 'rxjs';
import {Transaction, TransactionType} from '../../transactions/model/transaction';
import {Payee} from '../../payees/model/payee';

describe('BalanceTransactionDialogComponent', () => {
  let component: BalanceTransactionDialogComponent;
  const transaction = new Transaction(30.25, TransactionType.OUT, new Date(), 'payee 1', 1, 1, 1, 'test');

  const payeeService: any = {
    list: jest.fn()
  };

  beforeEach(() => {
    component = new BalanceTransactionDialogComponent([transaction, transaction, transaction], payeeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init and search the data', async () => {
    const payee1 = new Payee('payee 1', 1);
    const payee2 = new Payee('payee 2', 2);
    const payees = [payee1, payee2];

    payeeService.list.mockReturnValueOnce(of(payees));

    component.ngOnInit();

    expect(component.datasource.data.length).toBe(3);
    expect(component.payeeMap.size).toBe(2);
  });
});
