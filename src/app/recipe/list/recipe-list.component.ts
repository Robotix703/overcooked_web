import { Component, OnDestroy, OnInit } from '@angular/core'
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { categoriesRecipe, Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

import { MealService } from "../../meal/meal.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/snackBar/snack-bar.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[] = [];

  userIsAuthenticated = false;
  userId = null;
  isReady: boolean = false;
  isLoading: boolean = false;

  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageSize: number = 10;
  length: number = 0;
  currentPage: number = 0;
  searchName: string = "";
  selectedCategory: string = "";

  categoriesRecipe = categoriesRecipe;

  private authStatusSub: Subscription = new Subscription();

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    public route: ActivatedRoute,
    public MealService: MealService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getRecipes("", "", this.pageSize, this.currentPage);

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onDelete(recipeID: string) {
    const recipeName = this.recipes.find(e => e._id == recipeID)!.title;
    if (this.clickMethod(recipeName)) {
      this.recipeService.deleteRecipe(recipeID).subscribe(() => {
        this.getRecipes(this.selectedCategory, this.searchName, this.pageSize, this.currentPage);
      });
    }
  }

  addMeal(recipeID: string, numberOfLunch: number) {
    this.isLoading = true;
    this.MealService.createMeal(recipeID, numberOfLunch, () => {
      this.openSnackBar();
      this.isLoading = false;
    });
  }

  openSnackBar() {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 500,
    });
  }

  displayRecipes(recipes: Recipe[], count: number) {
    this.recipes = (recipes) ? recipes : [];
    this.length = count;
    this.currentPage = 0;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }

  getRecipesData(event?: PageEvent) {
    this.getRecipes(this.selectedCategory, this.searchName, event!.pageSize, event!.pageIndex);
    this.currentPage = event!.pageIndex;
  }

  search(event: any) {
    this.searchName = event.target.value;
    this.getRecipes(this.selectedCategory, event.target.value, this.pageSize, this.currentPage);
  }

  getRecipes(category: string, name: string, pageSize: number, currentPage: number) {
    this.isReady = false;
    this.recipeService.getFilteredRecipe(category, name, pageSize, currentPage).subscribe((data: { recipes: Recipe[], count: number }) => {
      this.formatDate(data.recipes);
      this.displayRecipes(data.recipes, data.count);
      this.isReady = true;
    });
  }

  formatDate(recipes: Recipe[]): void {
    for (let recipe of recipes) {
      recipe.lastCooked = (recipe.lastCooked) ? new Date(recipe.lastCooked).toLocaleString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }) : undefined;
    }
    //return recipes;
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.getRecipes(this.selectedCategory, this.searchName, this.pageSize, this.currentPage);
  }
}
