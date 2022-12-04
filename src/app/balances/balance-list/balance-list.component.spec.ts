import {of} from 'rxjs';
import {BalanceListComponent} from './balance-list.component';
import * as moment from 'moment';
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
    const previousMonth = moment().subtract(1, 'month');

    const nextBalance = balance;
    nextBalance.year = previousMonth.year();
    nextBalance.month = previousMonth.month();

    component.balances = [nextBalance];

    component.onLoadPreviousMonth();

    expect(balanceService.create).not.toBeCalled();
    expect(balanceLoaded.next).toBeCalled();
  });

  it('should load the next month', () => {
    const nextMonth = moment().add(1, 'month');

    const nextBalance = new Balance(nextMonth.month(), nextMonth.year(), 0, 100, []);

    component.balances = [nextBalance];

    component.onLoadNextMonth();

    expect(balanceService.create).not.toBeCalled();
    expect(balanceLoaded.next).toBeCalled();
  });

  it('should load the next month with none existing and thus one being created', async() => {
    component.balances = [];

    balanceService.create.mockReturnValueOnce(of(balance));

    await component.onLoadNextMonth();

    expect(balanceService.create).toBeCalled();
    expect(balanceLoaded.next).toBeCalled();
  });
});
