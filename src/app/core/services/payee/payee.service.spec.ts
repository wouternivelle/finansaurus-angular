import {PayeeService} from './payee.service';
import {Payee} from '../../../payees/model/payee';
import {environment} from "../../../../environments/environment";
import {of} from "rxjs";

describe('PayeeService', () => {
  let service: PayeeService;

  const httpClient: any = {
    get: jest.fn(),
    delete: jest.fn(),
    post: jest.fn()
  };

  beforeEach(() => {
    service = new PayeeService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list payees', done => {
    httpClient.get.mockReturnValueOnce(of({_embedded: {payees: [new Payee('payee 1', 1)]}}));

    service.list().subscribe(result => {
      expect(result.length).toEqual(1);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'payees');
      done();
    });
  });

  it('should list 0 payees when no _embedded present', done => {
    httpClient.get.mockReturnValueOnce(of({_test: [new Payee('payee 1', 1)]}));

    service.list().subscribe(result => {
      expect(result.length).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'payees');
      done();
    });
  });

  it('should save payee', done => {
    const payee = new Payee('payee 1');
    httpClient.post.mockReturnValueOnce(of(payee));

    service.save(payee).subscribe(result => {
      expect(result).toEqual(payee);
      expect(httpClient.post).toHaveBeenCalledWith(environment.apiURL + 'payees', payee);
      done();
    });
  });

  it('should fetch payee by id', done => {
    const payee = new Payee('payee 1');
    const id = 1;
    httpClient.get.mockReturnValueOnce(of(payee));

    service.fetch(id).subscribe(result => {
      expect(result).toEqual(payee);
      expect(httpClient.get).toHaveBeenCalledWith(environment.apiURL + 'payees/' + id);
      done();
    });
  });

  it('should delete payee', done => {
    const id = 1;
    httpClient.delete.mockReturnValueOnce(of(id));

    service.delete(id).subscribe(result => {
      expect(result).toEqual(id);
      expect(httpClient.delete).toHaveBeenCalledWith(environment.apiURL + 'payees/' + id);
      done();
    });
  });
});
