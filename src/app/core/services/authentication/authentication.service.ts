import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import {NGXLogger} from "ngx-logger";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import AuthProvider = firebase.auth.AuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  loggedIn = false;

  constructor(private router: Router, private firebaseAuth: AngularFireAuth, private logger: NGXLogger) {
    if (localStorage.getItem('auth')) {
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
          localStorage.setItem('auth', token);
          this.loggedIn = true;
        }).catch((error) => {
          this.logger.error(error);
        });
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn = false;
    this.router.navigate(['/auth/login']);
  }

}
