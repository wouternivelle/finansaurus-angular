import {Category, CategoryType} from "../../categories/model/category";
import * as TransformationHelper from '../../shared/helper/transformation.helper';
import {orderCategories} from '../../shared/helper/transformation.helper';

describe('TransformationHelper', () => {
  it('should transform and orden categories', () => {
    const parent = new Category('a parent', CategoryType.GENERAL, false, false, 1, null);
    const parentChild = new Category('a child', CategoryType.GENERAL, false, false, 2, 1);
    const parentChild2 = new Category('b child', CategoryType.GENERAL, false, false, 3, 1);
    const parent2 = new Category('b parent', CategoryType.GENERAL, false, false, 4, null);
    const parent2Child = new Category('c child', CategoryType.GENERAL, false, false, 5, 4);

    const result = orderCategories([parent2Child, parentChild2, parent2, parentChild, parent]);

    expect(result[0]).toEqual(parent2);
    expect(result[1]).toEqual(parent2Child);
    expect(result[2]).toEqual(parent);
    expect(result[3]).toEqual(parentChild);
    expect(result[4]).toEqual(parentChild2);
  });
});
