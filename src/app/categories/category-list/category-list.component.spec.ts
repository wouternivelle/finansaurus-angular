import {of} from 'rxjs';
import {CategoryListComponent} from './category-list.component';
import {Category, CategoryType} from '../model/category';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;

  const categoryService: any = {
    listWithoutSystem: jest.fn(),
    delete: jest.fn(),
  };
  const notificationService: any = {
    notify: jest.fn()
  };
  const matDialog: any = {
    open: jest.fn()
  };

  beforeEach(() => {
    component = new CategoryListComponent(categoryService, matDialog, notificationService);

    notificationService.notify.mockClear();
    categoryService.delete.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.categories).toBeDefined();
  });

  it('should init', async () => {
    const parent = new Category('parent', CategoryType.GENERAL, false, false, 1, null);
    const child = new Category('child', CategoryType.GENERAL, false, false, 2, 1);

    categoryService.listWithoutSystem.mockReturnValueOnce(of([parent, child]));

    await component.ngOnInit();

    expect(categoryService.listWithoutSystem).toHaveBeenCalled();

    expect(component.categories).toEqual([parent, child]);
    expect(component.parentCategories.get(1)).toEqual('parent');
  });

  it('should delete a category after confirmation', async () => {
    const category = new Category('parent', CategoryType.GENERAL, false, false, 1, null);
    const dialog = new class {
      afterClosed() {
        return of(true);
      }
    };

    matDialog.open.mockReturnValueOnce(dialog);
    categoryService.delete.mockReturnValueOnce(of(1));

    await component.onDelete(category);

    expect(matDialog.open).toHaveBeenCalled();
    expect(categoryService.delete).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalled();
  });

  it('should not delete a category after rejection', async () => {
    const dialog = new class {
      afterClosed() {
        return of(false);
      }
    };
    const category = new Category('account 1', CategoryType.GENERAL, false, false, null, null);

    matDialog.open.mockReturnValueOnce(dialog);
    categoryService.delete.mockReturnValueOnce(Promise.resolve());

    await component.onDelete(category);

    expect(matDialog.open).toHaveBeenCalled();
    expect(categoryService.delete).not.toHaveBeenCalled();
    expect(notificationService.notify).not.toHaveBeenCalled();
  });
});
