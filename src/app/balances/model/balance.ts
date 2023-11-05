export class BalanceCategory {
  categoryId: number;
  budgeted: number;
  operations: number;
  balance: number;

  constructor(categoryId: number, budgeted: number, operations: number, balance: number) {
    this.categoryId = categoryId;
    this.budgeted = budgeted;
    this.operations = operations;
    this.balance = balance;
  }
}

export class Balance {
  id: number | undefined;
  month: number;
  year: number;
  incoming = 0;
  budgeted: number;
  categories: BalanceCategory[] = [];

  constructor(month: number, year: number, incoming: number, budgeted: number, categories: BalanceCategory[], id?: number) {
    this.id = id;
    this.month = month;
    this.year = year;
    this.incoming = incoming;
    this.budgeted = budgeted;
    this.categories = categories;
  }
}
