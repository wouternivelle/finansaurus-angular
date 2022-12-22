import {Category} from '../../categories/model/category';

export const orderCategories = (categories: Category[]) => {
  let result: Category[] = [];
  const orderedMap: Map<number, Category[]> = new Map<number, Category[]>();

  // Fill the map with the keys
  categories.filter(cat => !cat.parent).forEach(category => {
    orderedMap.set(category.id!, []);
  });

  // Fill the entries with the categories who have a parent
  categories.filter(cat => cat.parent).forEach(category => {
    if (category.parent && orderedMap.has(category.parent)) {
      orderedMap.get(category.parent)!.push(category);
    }
  });

  // Create the resulting array
  orderedMap.forEach((value, key) => {
    const parent = categories.find(cat => cat.id === key);
    if (parent) {
      result.push(parent);
    }

    // Push kids but sorted
    result = result.concat(sortCategories(value));
  });

  return result;
};

function sortCategories(categories: Category[]): Category[] {
  return categories.sort((c1: Category, c2: Category) => {
    if (c1.name > c2.name) {
      return 1;
    }

    return -1;
  });
}
