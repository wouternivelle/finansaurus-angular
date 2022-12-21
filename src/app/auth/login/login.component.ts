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
    this.titleService.setTitle('Rhinance - Login');
  }

  onSubmit() {
    this.loading = true;
    let passwordControl = this.loginForm.get('password');
    if (!passwordControl || !passwordControl.value) {
      throw new Error('Form has not been correctly initialized.');
    }

    this.authenticationService.login(passwordControl.value)
      .subscribe({
        next: () => {
          this.router.navigate(['dashboard']);
        },
        error: () => {
          this.loginForm.get('password')?.setValue('');
          this.notificationService.notify("Incorrect password, please try again.");
          this.loading = false;
        }
      });
  }

  login() {
    this.loading = true;
    this.router.navigate(['/']);
  }
}
