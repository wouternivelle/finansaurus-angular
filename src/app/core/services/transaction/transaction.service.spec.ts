import {TransactionService} from './transaction.service';
import {of} from 'rxjs';
import {Transaction, TransactionType} from '../../../transactions/model/transaction';
import {environment} from "../../../../environments/environment";
import * as moment from 'moment';

describe('TransactionService', () => {
  let service: TransactionService;

  const httpClient: any = {
    get: jest.fn(),
    delete: jest.fn(),
    post: jest.fn()
  };

  const transaction = new Transaction(30.25, TransactionType.OUT, new Date(), 'payee 1', 1, 1, 1, 'test');

  beforeEach(() => {
    service = new TransactionService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list the transactions', done => {
    httpClient.get.mockReturnValueOnce(of({
      _embedded: {transactions: [transaction]},
      page: {number: 0, size: 10, totalElements: 2, totalPages: 1}
    }));

    service.list(0, 10).subscribe(result => {
      expect(result.transactions.length).toEqual(1);
      expect(result.size).toEqual(10);
      expect(result.totalElements).toEqual(2);
      expect(result.totalPages).toEqual(1);
      expect(result.index).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'transactions', expect.anything());
      done();
    });
  });

  it('should list 0 transactions when no _embedded present', done => {
    httpClient.get.mockReturnValueOnce(of({_test: []}));

    service.list(0, 10).subscribe(result => {
      expect(result.transactions.length).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'transactions', expect.anything());
      done();
    });
  });

  it('should save transaction', done => {
    httpClient.post.mockReturnValueOnce(of(transaction));

    const payload = {
      "accountId": transaction.accountId,
      "amount": transaction.amount,
      "categoryId": transaction.categoryId,
      "date": moment(transaction.date).format("YYYY-MM-DD"),
      "id": transaction.id,
      "note": transaction.note,
      "payeeName": transaction.payeeName,
      "type": transaction.type.valueOf(),
    };

    service.save(transaction).subscribe(result => {
      expect(result).toEqual(transaction);
      expect(httpClient.post).toHaveBeenCalledWith(environment.apiURL + 'transactions', payload);
      done();
    });
  });

  it('should fetch transaction by id', done => {
    const id = 1;
    httpClient.get.mockReturnValueOnce(of(transaction));

    service.fetch(id).subscribe(result => {
      expect(result).toEqual(transaction);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'transactions/' + id);
      done();
    });
  });

  it('should delete transaction', done => {
    const id = 1;
    httpClient.delete.mockReturnValueOnce(of(id));

    service.delete(id).subscribe(result => {
      expect(result).toEqual(id);
      expect(httpClient.delete).toHaveBeenCalledWith(environment.apiURL + 'transactions/' + id);
      done();
    });
  });

  it('should list the incoming transactions for a balance', done => {
    httpClient.get.mockReturnValueOnce(of({_embedded: {transactions: [transaction]}}));

    service.listIncomingTransactionsForBalance(10, 2022).subscribe(result => {
      expect(result.length).toEqual(1);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'transactions/incoming-for-balance/2022/11');
      done();
    });
  });

  it('should list 0 incoming transactions for a balance when nothing is found', done => {
    httpClient.get.mockReturnValueOnce(of({_test: {}}));

    service.listIncomingTransactionsForBalance(10, 2022).subscribe(result => {
      expect(result.length).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'transactions/incoming-for-balance/2022/11');
      done();
    });
  });

  it('should list the transactions for a month and category', done => {
    httpClient.get.mockReturnValueOnce(of({_embedded: {transactions: [transaction]}}));

    service.listTransactionsForMonthAndCategory(10, 2022, 1).subscribe(result => {
      expect(result.length).toEqual(1);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'transactions/list/2022/11/1');
      done();
    });
  });

  it('should list 0 transactions for a month and category when nothing is found', done => {
    httpClient.get.mockReturnValueOnce(of({_test: {}}));

    service.listTransactionsForMonthAndCategory(10, 2022, 1).subscribe(result => {
      expect(result.length).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'transactions/list/2022/11/1');
      done();
    });
  });
});
