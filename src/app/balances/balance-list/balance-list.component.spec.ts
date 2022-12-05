import {of} from 'rxjs';
import {BalanceListComponent} from './balance-list.component';
import {Balance} from '../model/balance';

describe('BalanceListComponent', () => {
  let component: BalanceListComponent;
  const balanceService: any = {
    list: jest.fn(),
    create: jest.fn()
  };
  const balanceLoaded: any = {
    next: jest.fn()
  };

  const balance = new Balance(new Date().getMonth(), new Date().getFullYear(), 0, 100, []);

  beforeEach(() => {
    component = new BalanceListComponent(balanceService);

    jest.resetAllMocks();
    component.balanceLoaded = balanceLoaded;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init with a found list of balances', async () => {
    balanceService.list.mockReturnValueOnce(of([balance]));

    await component.ngOnInit();

    expect(balanceService.list).toHaveBeenCalled();
    expect(balanceLoaded.next).toHaveBeenCalled();
  });

  it('should load the previous month', () => {
    balanceService.list.mockReturnValueOnce(of([balance]));
    component.balances = [balance];

    component.balances = [balance];

    component.onLoadPreviousMonth();

    expect(balanceService.list).toBeCalled();
    expect(balanceLoaded.next).toBeCalled();
  });

  it('should load the next month', () => {
    balanceService.list.mockReturnValueOnce(of([balance]));
    component.balances = [balance];

    component.onLoadNextMonth();

    expect(balanceService.list).toBeCalled();
    expect(balanceLoaded.next).toBeCalled();
  });
});
