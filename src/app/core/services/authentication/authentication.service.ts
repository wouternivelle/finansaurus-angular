import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import {NGXLogger} from "ngx-logger";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import AuthProvider = firebase.auth.AuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  loggedIn = false;

  constructor(private httpClient: HttpClient, private router: Router, private firebaseAuth: AngularFireAuth, private logger: NGXLogger) {
    if (sessionStorage.getItem('auth')) {
      this.loggedIn = true;
    }
  }

  loginWithGoogle(): Promise<void> {
    return this.loginWithProvider(new GoogleAuthProvider());
  }

  private loginWithProvider(provider: AuthProvider): Promise<void> {
    return this.firebaseAuth
      .signInWithPopup(provider)
      .then((user) => {
        return user.user!.getIdToken(true).then(token => {
          this.logger.log('You have been successfully logged in!');
          sessionStorage.setItem('auth', token);
          this.loggedIn = true;
        }).catch((error) => {
          this.logger.error(error);
        });
      })
      .catch((error) => {
        this.logger.error(error);
      });
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
