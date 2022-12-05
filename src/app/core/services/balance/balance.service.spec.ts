import {of} from 'rxjs';
import {BalanceService} from './balance.service';
import {Balance, BalanceCategory} from '../../../balances/model/balance';
import {environment} from "../../../../environments/environment";

describe('BalanceService', () => {
  let service: BalanceService;

  const httpClient: any = {
    get: jest.fn(),
    delete: jest.fn(),
    post: jest.fn(),
    patch: jest.fn()
  };

  const balance = new Balance(new Date().getMonth(), new Date().getFullYear(), 0, 100, []);

  beforeEach(() => {
    service = new BalanceService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list the balances', done => {
    httpClient.get.mockReturnValueOnce(of({_embedded: {balances: [balance]}}));

    const date = new Date();
    service.list(date).subscribe(result => {
      expect(result.length).toEqual(1);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'balances/' + date.getFullYear() + '/' + (date.getMonth() + 1));
      done();
    });
  });

  it('should list 0 balances when no _embedded present', done => {
    httpClient.get.mockReturnValueOnce(of({_test: []}));

    const date = new Date();
    service.list(date).subscribe(result => {
      expect(result.length).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'balances/' + date.getFullYear() + '/' + (date.getMonth() + 1));
      done();
    });
  });

  it('should save balance', done => {
    httpClient.post.mockReturnValueOnce(of(balance));

    service.save(balance).subscribe(result => {
      expect(result).toEqual(balance);
      expect(httpClient.post).toHaveBeenCalledWith(environment.baseUrl + 'balances', balance);
      done();
    });
  });

  it('should update budget of balance', done => {
    const balance = new Balance(new Date().getMonth(), new Date().getFullYear(), 0, 0,
      [new BalanceCategory(1, 1, 0, 1), new BalanceCategory(2, 2, 0, 2)]);
    httpClient.post.mockReturnValueOnce(of(balance));

    service.updateBudget(balance, 2, 3, [1]).subscribe(result => {
      expect(httpClient.post).toHaveBeenCalled();
      expect(result.categories[1].budgeted).toBe(3);
      done();
    });
  });

  it('should add budget of balance', done => {
    const balance = new Balance(new Date().getMonth(), new Date().getFullYear(), 0, 0,
      [new BalanceCategory(1, 1, 0, 1), new BalanceCategory(2, 2, 0, 2)]);
    httpClient.post.mockReturnValueOnce(of(balance));

    service.updateBudget(balance, 3, 3, [1, 2, 3]).subscribe(result => {
      expect(httpClient.post).toHaveBeenCalled();
      expect(result.categories[2].budgeted).toBe(3);
      done();
    });
  });

  it('should add budget of balance with no budgeted categories', done => {
    const balance = new Balance(new Date().getMonth(), new Date().getFullYear(), 0, 0, []);
    httpClient.post.mockReturnValueOnce(of(balance));

    service.updateBudget(balance, 3, 3, [1]).subscribe(result => {
      expect(httpClient.post).toHaveBeenCalled();
      done();
    });
  });

  it('should use the values of previous month', done => {
    httpClient.patch.mockReturnValueOnce(of(balance));

    service.usePreviousMonthValues(balance).subscribe(() => {
      expect(httpClient.patch).toHaveBeenCalledWith(environment.baseUrl + 'balances/use-previous-month', balance);
      done();
    });
  });
});
