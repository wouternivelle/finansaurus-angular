import {Transaction} from "./transaction";

export class TransactionsPage {
  transactions: Transaction[];
  index: number
  size: number;
  totalElements: number;
  totalPages: number;

  constructor(transactions: Transaction[], index:number, size: number, totalElements: number, totalPages: number) {
    this.transactions = transactions;
    this.index = index;
    this.size = size;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
  }
}
