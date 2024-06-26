import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import {NGXLogger} from "ngx-logger";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthProvider, GoogleAuthProvider} from '@angular/fire/auth';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  loggedIn = false;

  constructor(private router: Router, private firebaseAuth: AngularFireAuth, private logger: NGXLogger) {
    if (localStorage.getItem('auth')) {
      this.loggedIn = true;
    }

    this.firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.extractAndSaveToken(user!);
      } else {
        this.logout();
      }
    });
  }

  private extractAndSaveToken(user: firebase.User) {
    user.getIdToken(true).then(token => {
      localStorage.setItem('auth', token);
      this.loggedIn = true;
      if (this.router.url.includes('login')) {
        this.router.navigate(['dashboard']);
      }
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  loginWithGoogle(): Promise<void> {
    return this.loginWithProvider(new GoogleAuthProvider());
  }

  private loginWithProvider(provider: AuthProvider): Promise<void> {
    return this.firebaseAuth
      .signInWithPopup(provider)
      .then((user) => {
        this.extractAndSaveToken(user.user!);
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
    this.firebaseAuth.signOut();
    this.loggedIn = false;
    this.router.navigate(['/auth/login']);
  }

}
