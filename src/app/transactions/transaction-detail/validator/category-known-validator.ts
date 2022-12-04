import {AbstractControl, ValidatorFn} from '@angular/forms';
import {Category} from '../../../categories/model/category';

export function categoryKnownValidator(categories: Category[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const categoryName: string = control.value;

    if (categories.some(category => category.name === categoryName)) {
      return null;
    } else {
      return {categoryName: {value: categoryName}};
    }
  };
}
