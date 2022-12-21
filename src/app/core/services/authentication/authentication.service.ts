import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  loggedIn = false;

  constructor(private httpClient: HttpClient, private router: Router) {
    if (sessionStorage.getItem('auth')) {
      this.loggedIn = true;
    }
  }

  login(password: string): Observable<any> {
    const encodedAuth = window.btoa('user:' + password);
    const headers: HttpHeaders = new HttpHeaders({'Authorization': 'Basic ' + encodedAuth});
    return this.httpClient.head(environment.apiURL + 'login', {headers: headers})
      .pipe(map(() => {
        sessionStorage.setItem('auth', encodedAuth);
        this.loggedIn = true;
      }));
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout(): void {
    sessionStorage.clear();
    this.loggedIn = false;
    this.router.navigate(['/auth/login']);
  }

}
