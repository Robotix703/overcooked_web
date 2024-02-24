import { Component, OnInit } from '@angular/core'
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { ActivatedRoute } from '@angular/router';
import { Ingredient } from '../ingredient.model';
import { IngredientService } from '../ingredient.service';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})

export class IngredientListComponent implements OnInit {

  ingredients: Ingredient[] = [];
  length: number = 0;
  searchName: string = "";
  isReady: boolean = false;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(
    public route: ActivatedRoute,
    public IngredientService: IngredientService) { }

  ngOnInit() {
    this.getIngredients(this.searchName, this.pageSize, this.currentPage);
  }

  onDelete(ingredient: Ingredient) {
    if (this.clickMethod(ingredient.name)) {
      this.IngredientService.deleteIngredient(ingredient._id)
      .subscribe(() => {
        this.getIngredients(this.searchName, this.pageSize, this.currentPage);
      });
    }
  }

  getIngredientsData(event?: PageEvent) {
    this.getIngredients(this.searchName, event!.pageSize, event!.pageIndex);
    this.currentPage = event!.pageIndex;
  }

  search(event: any){
    this.searchName = event.target.value;
    this.getIngredients(this.searchName, this.pageSize, this.currentPage);
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }

  getIngredients(searchName: string, pageSize: number = 10, currentPage: number = 1){
    this.isReady = false;
    this.IngredientService.getIngredients(searchName, pageSize, currentPage)
      .subscribe((fetchedData) => {
        this.ingredients = fetchedData.ingredients;
        this.isReady = true;
        this.length = fetchedData.count;
      });
  }

  getIngredientData(event?: PageEvent) {
    this.getIngredients(this.searchName, event!.pageSize, event!.pageIndex);
    this.currentPage = event!.pageIndex;
  }
}
