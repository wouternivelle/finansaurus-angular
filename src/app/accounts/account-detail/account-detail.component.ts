import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../core/services/account/account.service';
import {Account, AccountType} from '../model/account';
import {NotificationService} from '../../core/services/notification.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  edit = false;

  // Controls
  accountForm = new FormGroup({
    name: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    starred: new FormControl(false, Validators.required)
  });
  accountType = AccountType;

  constructor(private route: ActivatedRoute,
              private accountService: AccountService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    const accountId: number = this.route.snapshot.params['id'];
    if (accountId) {
      this.edit = true;
      this.accountService.fetch(accountId)
        .subscribe(account => {
          this.accountForm.get('name')!.setValue(account.name);
          this.accountForm.get('amount')!.setValue(account.amount.toString());
          this.accountForm.get('type')!.setValue(account.type.toString());
          this.accountForm.get('starred')!.setValue(account.starred);
        });
    }
  }

  onSubmit() {
    const accountId: number | undefined = this.route.snapshot.params['id'];
    const account = new Account(this.accountForm.get('name')!.value!, <AccountType>this.accountForm.get('type')!.value!, Number(this.accountForm.get('amount')!.value), this.accountForm.get('starred')!.value!, accountId);

    this.accountService.save(account)
      .subscribe(account => {
        this.notificationService.openSnackBar('Account ' + account.name ? 'updated' : 'added');
        this.router.navigate(['accounts']);
      });
  }
}
