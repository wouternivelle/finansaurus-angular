import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {User} from "../../../auth/model/user";
import {map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  loggedIn = false;

  constructor(private httpClient: HttpClient, private router: Router) {
    if (sessionStorage.getItem('user')) {
      this.loggedIn = true;
    }
  }

  login(password: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'login', {password: password})
      .pipe(map(user => {
        if (user) {
          sessionStorage.setItem('user', JSON.stringify(new User(window.btoa('user:' + password))));
          this.loggedIn = true;
        }
        return user;
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
