import {of} from 'rxjs';
import {PayeeListComponent} from './payee-list.component';
import {Payee} from '../model/payee';

describe('BalanceDetailComponent', () => {
  let component: PayeeListComponent;

  const payeeService: any = {
    list: jest.fn(),
    add: jest.fn(),
    delete: jest.fn()
  };
  const matDialog: any = {
    open: jest.fn()
  };
  const notificationService: any = {
    notify: jest.fn()
  };

  beforeEach(() => {
    component = new PayeeListComponent(payeeService, matDialog, notificationService);

    notificationService.notify.mockClear();
    payeeService.delete.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', async () => {
    const payee = new Payee('payee 1', 1);
    payeeService.list.mockReturnValueOnce(of([payee]));

    await component.ngOnInit();

    expect(payeeService.list).toHaveBeenCalled();

    expect(component.payees).toEqual([payee]);
  });

  it('should delete a payee after confirmation', async () => {
    const dialog = new class {
      afterClosed() {
        return of(true);
      }
    };

    matDialog.open.mockReturnValueOnce(dialog);
    payeeService.delete.mockReturnValueOnce(of(1));

    await component.onDelete(new Payee('payee 1', 1));

    expect(matDialog.open).toHaveBeenCalled();
    expect(payeeService.delete).toHaveBeenCalled();
    expect(payeeService.list).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalled();
  });

  it('should not delete a payee after rejection', async () => {
    const dialog = new class {
      afterClosed() {
        return of(false);
      }
    };

    matDialog.open.mockReturnValueOnce(dialog);
    payeeService.delete.mockReturnValueOnce(of(1));

    await component.onDelete(new Payee('payee 1'));

    expect(matDialog.open).toHaveBeenCalled();
    expect(payeeService.delete).not.toHaveBeenCalled();
    expect(notificationService.notify).not.toHaveBeenCalled();
  });
});
