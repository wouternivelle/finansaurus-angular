import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Payee} from '../model/payee';
import {PayeeService} from '../../core/services/payee/payee.service';
import {NotificationService} from '../../core/services/notification.service';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-payee-detail',
    templateUrl: './payee-detail.component.html',
    styleUrls: ['./payee-detail.component.css'],
    imports: [MatCard, MatCardHeader, NgIf, MatCardTitle, MatCardContent, ReactiveFormsModule, MatFormField, MatInput, MatButton]
})
export class PayeeDetailComponent implements OnInit {
  edit = false;

  // Controls
  payeeForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(private route: ActivatedRoute,
              private payeeService: PayeeService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    const payeeId: number = Number(this.route.snapshot.params['id']);
    if (payeeId) {
      this.edit = true;
      this.payeeService.fetch(payeeId)
        .subscribe(payee => {
          this.payeeForm.get('name')!.setValue(payee.name);
        });
    }
  }

  onSubmit() {
    const payeeId: number = Number(this.route.snapshot.params['id']);
    const payee = new Payee(this.payeeForm.get('name')!.value!, payeeId);

    this.payeeService.save(payee)
      .subscribe(payee => {
        this.notificationService.notify('Payee ' + payee.name + ' saved');
        this.router.navigate(['payees']);
      });

  }
}
