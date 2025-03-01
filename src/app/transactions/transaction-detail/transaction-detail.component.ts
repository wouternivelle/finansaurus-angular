import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../core/services/category/category.service';
import {NotificationService} from '../../core/services/notification.service';
import {Payee} from '../../payees/model/payee';
import {Account} from '../../accounts/model/account';
import {Category, CategoryType} from '../../categories/model/category';
import {combineLatest, ObservableInput} from 'rxjs';
import {AccountService} from '../../core/services/account/account.service';
import {PayeeService} from '../../core/services/payee/payee.service';
import {TransactionService} from '../../core/services/transaction/transaction.service';
import {Transaction, TransactionType} from '../model/transaction';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {categoryKnownValidator} from './validator/category-known-validator';
import moment from 'moment';
import {Balance} from '../../balances/model/balance';
import { MatButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { NgIf, NgFor } from '@angular/common';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
    selector: 'app-transaction-detail',
    templateUrl: './transaction-detail.component.html',
    styleUrls: ['./transaction-detail.component.css'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    ],
    standalone: true,
    imports: [MatCard, MatCardHeader, NgIf, MatCardTitle, MatCardContent, ReactiveFormsModule, MatFormField, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatAutocompleteTrigger, MatAutocomplete, NgFor, MatOption, MatSelect, MatButton]
})
export class TransactionDetailComponent implements OnInit {
  categories: Category[] = [];
  accounts: Account[] = [];
  payees: Payee[] = [];
  balances: Balance[] = [];
  transactionType = TransactionType;
  currentTransaction: Transaction | undefined;

  filteredPayees: Payee[] = [];
  filteredCategories: Category[] = [];

  edit = false;

  @ViewChild('payeeInputRef') payeeInput: ElementRef | undefined;

  // Controls
  transactionForm = new FormGroup({
    date: new FormControl(moment(), Validators.required),
    payee: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    account: new FormControl(0, Validators.required),
    amount: new FormControl('', Validators.required),
    note: new FormControl(''),
    type: new FormControl(TransactionType.OUT, Validators.required)
  });

  constructor(private categoryService: CategoryService,
              private accountService: AccountService,
              private payeeService: PayeeService,
              private transactionService: TransactionService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    const observables: ObservableInput<any>[] = [this.accountService.list(), this.categoryService.list(), this.payeeService.list()];

    const transactionId: number = Number(this.route.snapshot.params['id']);
    if (transactionId) {
      this.edit = true;
      observables.push(this.transactionService.fetch(transactionId));
    }

    // Fetch all the data
    combineLatest(observables)
      .subscribe(([accounts, categories, payees, transaction]) => {
        this.accounts = accounts;
        this.payees = payees;

        // Filter parent categories
        this.categories = categories.filter((category: Category) =>
          category.parent !== null || (category.system && (CategoryType.INITIAL !== category.type))
        );

        // Filter the categories and payees based on the input
        this.doFilterCategories();
        this.doFilterPayees();

        // Use the starred account if it's not an edit
        if (!this.edit) {
          this.useStarredAccount();
        }

        // Add validation to the form
        this.transactionForm.get('category')!.setValidators([
          Validators.required,
          categoryKnownValidator(this.categories)
        ]);

        // Fill in the form
        if (transactionId) {
          this.fillForm(transaction);
        }
      });

    this.onChange();
  }

  private fillForm(transaction: Transaction): void {
    this.currentTransaction = transaction;

    const payee = this.payees.find(p => transaction.payeeId === p.id);
    this.transactionForm.get('payee')!.setValue(payee!.name!);
    const category = this.categories.find(c => transaction.categoryId === c.id);
    this.transactionForm.get('category')!.setValue(category!.name!);
    const account = this.accounts.find(a => transaction.accountId === a.id);
    this.transactionForm.get('account')!.setValue(account!.id!);
    this.transactionForm.get('date')!.setValue(moment(transaction.date));
    this.transactionForm.get('amount')!.setValue(transaction.amount.toString());
    if (transaction.note) {
      this.transactionForm.get('note')!.setValue(transaction.note);
    }
    this.transactionForm.get('type')!.setValue(transaction.type);
  }

  onSubmit(addAnother = false) {
    const foundCategory = this.categories.find(category => category.name === this.transactionForm.get('category')!.value);
    const transactionId = Number(this.route.snapshot.params['id']);

    const transaction = new Transaction(
      Number(this.transactionForm.get('amount')!.value),
      TransactionType[this.transactionForm.get('type')!.value!],
      this.transactionForm.get('date')!.value!.toDate(),
      this.transactionForm.get('payee')!.value!,
      Number(this.transactionForm.get('account')!.value),
      Number(foundCategory!.id),
      transactionId,
      this.transactionForm.get('note')!.value!
    );

    this.transactionService.save(transaction)
      .subscribe(() => {
        this.notificationService.notify('Transaction for ' + transaction.payeeName + ' saved');
        if (addAnother) {
          this.resetForm(transaction);
          this.payeeInput!.nativeElement.focus();
        } else {
          this.router.navigate(['transactions']);
        }
      });
  }

  private resetForm(transaction: Transaction) {
    this.transactionForm.reset();
    this.useStarredAccount();
    this.transactionForm.get('date')?.setValue(moment(transaction.date));
    this.transactionForm.get('category')!.setValidators([
      Validators.required,
      categoryKnownValidator(this.categories)
    ]);
    this.transactionForm.get('type')?.setValue(TransactionType.OUT);
  }

  doFilterPayees(): void {
    this.filteredPayees = this.payees.filter(payee => {
      if (!this.transactionForm.get('payee')!.value) {
        return true;
      }
      return payee.name.toLowerCase().includes(this.transactionForm.get('payee')!.value!.toLowerCase());
    });
  }

  doFilterCategories(): void {
    const categoryValue = this.transactionForm.get('category')!.value;
    if (!categoryValue) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(categoryValue.toLowerCase())
      );
    }
  }

  isPositive(): boolean {
    return this.transactionForm.get('type')!.value === TransactionType.IN;
  }

  onPayeeSelected(): void {
    if (this.transactionForm.get('payee')) {
      const foundPayee = this.payees.find(payee => payee.name === this.transactionForm.get('payee')!.value);
      if (foundPayee && foundPayee.lastCategoryId) {
        const foundCategory = this.categories
          .find(category => category.id === foundPayee.lastCategoryId);
        if (foundCategory) {
          this.transactionForm.get('category')!.setValue(foundCategory.name);
        }
      }
    }
  }

  onChangeType(type: TransactionType): void {
    this.transactionForm.get('type')!.setValue(type);
  }

  private useStarredAccount(): void {
    const starredAccount = this.accounts.find(account => account.starred);
    if (starredAccount) {
      this.transactionForm.get('account')!.setValue(starredAccount.id!);
    }
  }

  private onChange(): void {
    this.transactionForm.get('category')!.valueChanges.subscribe(() => {
      this.doFilterCategories();
    });
    this.transactionForm.get('payee')!.valueChanges.subscribe(() => {
      this.doFilterPayees();
    });
  }
}
