import {categoryKnownValidator} from './category-known-validator';
import {Category, CategoryType} from '../../../categories/model/category';
import {FormControl, ValidatorFn} from '@angular/forms';

describe('CategoryKnownValidator', () => {
  let validator: ValidatorFn;
  const control = new FormControl('categoryName');

  beforeEach(() => {
    const parent = new Category('parent', CategoryType.GENERAL, false, false, 1, null);
    const child = new Category('child', CategoryType.GENERAL, false, false, 2, 1);

    validator = categoryKnownValidator([parent, child]);
  });

  it('should validate when the category name is present', () => {
    control.setValue('child');

    const result = validator(control);

    expect(result).toBeNull();
  });

  it('should invalidate when the category name is not present', () => {
    control.setValue('child 2');

    const result = validator(control);

    expect(result).toBeTruthy();
    expect(result!['categoryName'].value).toBe('child 2');
  });
});
