import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Category, CategoryType} from '../model/category';
import {CategoryService} from '../../core/services/category/category.service';
import {NotificationService} from "../../core/services/notification.service";

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  categories: Category[] = [];
  parentCategories: Map<number, string> = new Map<number, string>();

  edit = false;
  hasParent = false;

  // Controls
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    parent: new FormControl(),
    hidden: new FormControl(false, Validators.required)
  });

  constructor(private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    const categoryId = Number(this.route.snapshot.params['id']);
    if (categoryId) {
      this.edit = true;
    }

    this.categoryService.listWithoutSystem()
      .subscribe(categories => {
        // Collect the parent categories
        categories.filter(cat => cat.parent == null).forEach((cat: Category) => {
          this.parentCategories.set(cat.id!, cat.name);
        });

        const category = categories.find(c => categoryId === c.id)!;

        this.categoryForm.get('name')!.setValue(category.name);
        this.categoryForm.get('hidden')!.setValue(category.hidden);
        if (category.parent) {
          this.categoryForm.get('parent')!.setValue(category.parent);
          this.hasParent = true;
        }
      });
  }

  onSubmit() {
    const categoryId: number | null = this.route.snapshot.params['id'];
    const parent: number | null = this.categoryForm.get('parent')!.value !== null ? Number(this.categoryForm.get('parent')!.value) : null;
    const category = new Category(this.categoryForm.get('name')!.value!, CategoryType.GENERAL, false, this.categoryForm.get('hidden')!.value!, categoryId, parent);

    this.categoryService.save(category)
      .subscribe(() => {
        this.notificationService.openSnackBar('Category ' + category.name ? 'updated' : 'added');
        this.router.navigate(['categories']);
      });
  }
}
