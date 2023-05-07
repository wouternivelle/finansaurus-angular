import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {NotificationService} from '../../core/services/notification.service';
import {AuthenticationService} from "../../core/services/authentication/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading: boolean = false;

  // Controls
  loginForm = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private titleService: Title,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Finansaurus - Login');
  }

  loginWithGoogle() {
    this.authenticationService.loginWithGoogle()
      .then(() => this.router.navigate(['dashboard']));
  }
}
