import {of} from 'rxjs';
import {CategoryService} from './category.service';
import {Category, CategoryType} from '../../../categories/model/category';
import {environment} from "../../../../environments/environment";

describe('CategoryService', () => {
  let service: CategoryService;

  const category = new Category('account 1', CategoryType.GENERAL, false, false, null, null);

  const httpClient: any = {
    get: jest.fn(),
    delete: jest.fn(),
    post: jest.fn()
  };

  beforeEach(() => {
    service = new CategoryService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list categories', done => {
    httpClient.get.mockReturnValueOnce(of({_embedded: {categories: [category]}}));

    service.list().subscribe(result => {
      expect(result.length).toEqual(1);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'categories');
      done();
    });
  });

  it('should list 0 categories when no _embedded present', done => {
    httpClient.get.mockReturnValueOnce(of({_test: []}));

    service.list().subscribe(result => {
      expect(result.length).toEqual(0);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'categories');
      done();
    });
  });

  it('should list categories with system excluded', done => {
    httpClient.get.mockReturnValueOnce(of({_embedded: {categories: [category]}}));

    service.listWithoutSystem().subscribe(result => {
      expect(result.length).toEqual(1);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'categories/no-system');
      done();
    });
  });

  it('should save category', done => {
    httpClient.post.mockReturnValueOnce(of(category));

    service.save(category).subscribe(result => {
      expect(result).toEqual(category);
      expect(httpClient.post).toHaveBeenCalledWith(environment.baseUrl + 'categories', category);
      done();
    });
  });

  it('should fetch category by id', done => {
    const id = 1;
    httpClient.get.mockReturnValueOnce(of(category));

    service.fetch(id).subscribe(result => {
      expect(result).toEqual(category);
      expect(httpClient.get).toHaveBeenCalledWith(environment.baseUrl + 'categories/' + id);
      done();
    });
  });

  it('should delete category', done => {
    const id = 1;
    httpClient.delete.mockReturnValueOnce(of(id));

    service.delete(id).subscribe(result => {
      expect(result).toEqual(id);
      expect(httpClient.delete).toHaveBeenCalledWith(environment.baseUrl + 'categories/' + id);
      done();
    });
  });
});
