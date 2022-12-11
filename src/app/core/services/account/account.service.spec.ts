import {of} from 'rxjs';
import {AccountService} from './account.service';
import {Account, AccountType} from '../../../accounts/model/account';
import {environment} from "../../../../environments/environment";

describe('AccountService', () => {
  let service: AccountService;

  const account = new Account('account 1', AccountType.CHECKINGS, 0, false);

  const httpClient: any = {
    get: jest.fn(),
    delete: jest.fn(),
    post: jest.fn()
  };

  beforeEach(() => {
    service = new AccountService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list accounts', done => {
    httpClient.get.mockReturnValueOnce(of({_embedded: {accounts: [account]}}));

    service.list().subscribe(result => {
      expect(result.length).toEqual(1);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'accounts');
      done();
    });
  });

  it('should list 0 payees when no _embedded present', done => {
    httpClient.get.mockReturnValueOnce(of({_test: []}));

    service.list().subscribe(result => {
      expect(result.length).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'accounts');
      done();
    });
  });

  it('should save account', done => {
    httpClient.post.mockReturnValueOnce(of(account));

    service.save(account).subscribe(result => {
      expect(result).toEqual(account);
      expect(httpClient.post).toHaveBeenCalledWith(environment.apiURL + 'accounts', account);
      done();
    });
  });

  it('should fetch account by id', done => {
    const id = 1;
    httpClient.get.mockReturnValueOnce(of(account));

    service.fetch(id).subscribe(result => {
      expect(result).toEqual(account);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'accounts/' + id);
      done();
    });
  });

  it('should delete account', done => {
    const id = 1;
    httpClient.delete.mockReturnValueOnce(of(id));

    service.delete(id).subscribe(result => {
      expect(result).toEqual(id);
      expect(httpClient.delete).toHaveBeenCalledWith(environment.apiURL + 'accounts/' + id);
      done();
    });
  });
});
