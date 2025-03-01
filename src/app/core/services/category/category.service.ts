import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Category} from '../../../categories/model/category';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class CategoryService {
  constructor(private http: HttpClient) {
  }

  public list(): Observable<Category[]> {
    return this.http.get<any>(environment.apiURL + 'categories')
      .pipe(map(result => {
        if (result._embedded) {
          return result._embedded.categories as Category[];
        } else {
          return [];
        }
      }));
  }

  public listWithoutSystem(): Observable<Category[]> {
    return this.http.get<any>(environment.apiURL + 'categories/no-system')
      .pipe(map(result => {
        if (result._embedded) {
          return result._embedded.categories as Category[];
        } else {
          return [];
        }
      }));
  }

  public save(category: Category): Observable<Category> {
    return this.http.post<Category>(environment.apiURL + 'categories', category);
  }

  public fetch(id: number): Observable<Category> {
    return this.http.get<Category>(environment.apiURL + 'categories/' + id);
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(environment.apiURL + 'categories/' + id);
  }
}
