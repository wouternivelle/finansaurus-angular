import {of} from 'rxjs';
import {CategoryDetailComponent} from './category-detail.component';
import {Category, CategoryType} from '../model/category';

describe('CategoryDetailComponent', () => {
  let component: CategoryDetailComponent;

  const categoryService: any = {
    save: jest.fn(),
    listWithoutSystem: jest.fn()
  };
  const router: any = {
    navigate: jest.fn()
  };
  const notificationService: any = {
    notify: jest.fn()
  };
  const route: any = {
    'snapshot': {
      'params': {'id': 2}
    }
  };

  beforeEach(() => {
    component = new CategoryDetailComponent(categoryService, route, router, notificationService);
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

    expect(component.parentCategories.get(1)).toEqual('parent');
    expect(component.hasParent).toEqual(true);
  });

  it('should create a new category on submit', async () => {
    const category = new Category('parent', CategoryType.GENERAL, false, false, 1, null);
    component.categoryForm.get('name')!.setValue('name1');
    component.categoryForm.get('parent')!.setValue('1');

    categoryService.save.mockReturnValueOnce(of(category));

    await component.onSubmit();

    expect(categoryService.save).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalledWith('Category parent saved');
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should create a new parent category on submit', async () => {
    const category = new Category('parent', CategoryType.GENERAL, false, false, 1, null);
    component.categoryForm.get('name')!.setValue('name1');

    categoryService.save.mockReturnValueOnce(of(category));

    await component.onSubmit();

    expect(categoryService.save).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalledWith('Category parent saved');
    expect(router.navigate).toHaveBeenCalled();
  });
});
