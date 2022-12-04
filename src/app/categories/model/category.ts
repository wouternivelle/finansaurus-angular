export enum CategoryType {
  GENERAL = 'GENERAL',
  INCOME_CURRENT_MONTH = 'INCOME_CURRENT_MONTH',
  INCOME_NEXT_MONTH = 'INCOME_NEXT_MONTH',
  INITIAL = 'INITIAL'
}

export class Category {
  id: number | null;
  name: string;
  type: CategoryType;
  system: boolean;
  parent: number | null;
  hidden: boolean;

  constructor(name: string, type: CategoryType, system: boolean, hidden: boolean, id: number | null, parent: number | null) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.system = system;
    this.parent = parent;
    this.hidden = hidden;
  }
}
