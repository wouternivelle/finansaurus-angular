import {Component, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Category} from '../model/category';
import {CategoryService} from '../../core/services/category/category.service';
import {NotificationService} from '../../core/services/notification.service';
import * as TransformationHelper from '../../shared/helper/transformation.helper';
import { MatMenuTrigger, MatMenu, MatMenuContent, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatIconButton, MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css'],
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, NgClass, MatIconButton, RouterLink, MatIcon, MatMenuTrigger, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatButton, MatMenu, MatMenuContent, MatMenuItem]
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
        this.categories = TransformationHelper.orderCategories(categories);

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
            this.notificationService.notify(category.name + ' is deleted');
          });
      }
    });
  }
}
