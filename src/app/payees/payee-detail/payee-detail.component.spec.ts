import {of} from 'rxjs';
import {PayeeDetailComponent} from './payee-detail.component';
import {Payee} from '../model/payee';

describe('PayeeDetailComponent', () => {
  let component: PayeeDetailComponent;

  const payeeService: any = {
    save: jest.fn(),
    delete: jest.fn(),
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
    component = new PayeeDetailComponent(route, payeeService, router, notificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init correctly with a payee id', async () => {
    const payee = new Payee('payee 1', 1);

    payeeService.fetch.mockReturnValueOnce(of(payee));

    await component.ngOnInit();

    expect(payeeService.fetch).toHaveBeenCalled();
    expect(component.edit).toBeTruthy();
  });

  it('should create a new payee on submit', async () => {
    const payee = new Payee('payee 1', 1);
    component.payeeForm.get('name')!.setValue('name1');

    payeeService.save.mockReturnValueOnce(of(payee));

    await component.onSubmit();

    expect(payeeService.save).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });
});
