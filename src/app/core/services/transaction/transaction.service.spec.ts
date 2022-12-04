import {TransactionService} from './transaction.service';
import {of} from 'rxjs';
import {Transaction, TransactionType} from '../../../transactions/model/transaction';
import {environment} from "../../../../environments/environment";

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
    httpClient.get.mockReturnValueOnce(of({_embedded: {transactions: [transaction]}}));

    service.list(0, 10).subscribe(result => {
      expect(result.length).toEqual(1);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'transactions');
      done();
    });
  });

  it('should list 0 transactions when no _embedded present', done => {
    httpClient.get.mockReturnValueOnce(of({_test: []}));

    service.list(0, 10).subscribe(result => {
      expect(result.length).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'transactions');
      done();
    });
  });

  it('should save transaction', done => {
    httpClient.post.mockReturnValueOnce(of(transaction));

    service.save(transaction).subscribe(result => {
      expect(result).toEqual(transaction);
      expect(httpClient.post).toHaveBeenCalledWith(environment.baseUrl + 'transactions', transaction);
      done();
    });
  });

  it('should fetch transaction by id', done => {
    const id = 1;
    httpClient.get.mockReturnValueOnce(of(transaction));

    service.fetch(id).subscribe(result => {
      expect(result).toEqual(transaction);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'transactions/' + id);
      done();
    });
  });

  it('should delete transaction', done => {
    const id = 1;
    httpClient.delete.mockReturnValueOnce(of(id));

    service.delete(id).subscribe(result => {
      expect(result).toEqual(id);
      expect(httpClient.delete).toHaveBeenCalledWith(environment.baseUrl + 'transactions/' + id);
      done();
    });
  });

  it('should list the incoming transactions for a balance', done => {
    httpClient.get.mockReturnValueOnce(of({_embedded: {transactions: [transaction]}}));
    ;

    service.listIncomingTransactionsForBalance(10, 2022).subscribe(result => {
      expect(result.length).toEqual(1);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'transactions/incoming-for-balance');
      done();
    });
  });

  it('should list 0 incoming transactions for a balance when nothing is found', done => {
    httpClient.get.mockReturnValueOnce(of({_test: {}}));

    service.listIncomingTransactionsForBalance(10, 2022).subscribe(result => {
      expect(result.length).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'transactions/incoming-for-balance');
      done();
    });
  });
});
