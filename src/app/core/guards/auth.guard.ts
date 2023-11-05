import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from "../services/authentication/authentication.service";


@Injectable()
export class AuthGuard  {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
  }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['auth/login']);
    return false;
  }
}
