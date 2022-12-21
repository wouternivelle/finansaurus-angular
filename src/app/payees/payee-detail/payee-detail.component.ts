import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Payee} from '../model/payee';
import {PayeeService} from '../../core/services/payee/payee.service';
import {NotificationService} from '../../core/services/notification.service';

@Component({
  selector: 'app-payee-detail',
  templateUrl: './payee-detail.component.html',
  styleUrls: ['./payee-detail.component.css']
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
          let nameControl = this.payeeForm.get('name');
          if (!nameControl) {
            throw new Error('Form has not been correctly initialized.');
          }

          nameControl.setValue(payee.name);
        });
    }
  }

  onSubmit() {
    let nameControl = this.payeeForm.get('name');
    if (!nameControl || !nameControl.value) {
      throw new Error('Form has not been correctly initialized.');
    }

    const payeeId: number = Number(this.route.snapshot.params['id']);
    const payee = new Payee(nameControl.value, payeeId);

    this.payeeService.save(payee)
      .subscribe(savedPayee => {
        const result = this.edit ? 'updated' : 'added';
        this.notificationService.notify(savedPayee.name + ' is ' + result);
        this.router.navigate(['payees']);
      });

  }
}
