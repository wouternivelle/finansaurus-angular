import {Component, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Category} from '../model/category';
import {CategoryService} from '../../core/services/category/category.service';
import {NotificationService} from '../../core/services/notification.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];
  parentCategories: Map<number, string> = new Map<number, string>();

  displayedColumns = ['name', 'actions'];

  constructor(private categoryService: CategoryService,
              private dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    this.categoryService.listWithoutSystem()
      .subscribe(categories => {
        this.categories = this.orderCategories(categories);

        // Collect the parent categories
        this.categories.filter(cat => cat.parent == null).forEach((category: Category) => {
          this.parentCategories.set(category.id!, category.name);
        });
      });
  }

  onDelete(category: Category) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete this category?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && category.id) {
        this.categoryService.delete(category.id)
          .subscribe(() => {
            this.notificationService.openSnackBar(category.name + ' is deleted');
          });
      }
    });
  }


  private orderCategories(categories: Category[]): Category[] {
    if (!categories) {
      return categories;
    }

    let result: Category[] = [];
    const orderedMap: Map<number, Category[]> = new Map<number, Category[]>();

    // Fill the map with the keys
    categories.filter(cat => !cat.parent).forEach((category: Category) => {
      orderedMap.set(category.id!, []);
    });

    // Fill the entries with the categories who have a parent
    categories.filter(category => category.parent).forEach(category => {
      if (orderedMap.has(category.parent!)) {
        orderedMap.get(category.parent!)!.push(category);
      }
    });

    // Create the resulting array
    orderedMap.forEach((value, key) => {
      const parent = categories.find(cat => cat.id === key)!;
      result.push(parent);

      // Push kids but sorted
      result = result.concat(this.sortCategories(value));
    });

    return result;
  };

  private sortCategories(categories: Category[]): Category[] {
    return categories.sort((c1: Category, c2: Category) => {
      if (c1.name > c2.name) {
        return 1;
      }

      if (c1.name < c2.name) {
        return -1;
      }

      return 0;
    });
  }
}
