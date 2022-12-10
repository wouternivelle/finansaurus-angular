export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT'
}

export class Transaction {
  id?: number;
  amount: number;
  type: TransactionType;
  note?: string;
  date: Date;
  payeeName?: string;
  payeeId?: number;
  accountId: number;
  categoryId: number;

  constructor(amount: number, type: TransactionType, date: Date, payeeName: string, accountId: number, categoryId: number, id?: number, note?: string) {
    this.id = id;
    this.amount = amount;
    this.type = type;
    this.note = note;
    this.date = date;
    this.accountId = accountId;
    this.categoryId = categoryId;
    this.payeeName = payeeName;
  }
}
