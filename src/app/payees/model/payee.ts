export class Payee {
  id: number | undefined;
  name: string;
  lastCategoryId: number | undefined;

  constructor(name: string, id?: number | undefined, lastCategoryId?: number) {
    this.id = id;
    this.name = name;
    this.lastCategoryId = lastCategoryId;
  }

}
