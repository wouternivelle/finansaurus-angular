export enum AccountType {
  CHECKINGS = 'CHECKINGS',
  SAVINGS = 'SAVINGS'
}

export class Account {
  id: number | undefined;
  name: string;
  type: AccountType;
  amount = 0;
  starred = false;


  constructor(name: string, type: AccountType, amount: number = 0, starred: boolean = false, id?: number | undefined) {
    this.name = name;
    this.type = type;
    this.amount = amount;
    this.starred = starred;
    this.id = id;
  }
}

