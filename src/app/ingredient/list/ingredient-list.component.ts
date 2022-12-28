import { Component, OnInit } from '@angular/core'
import { PageEvent } from '@angular/material/paginator';
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
  limit: number = 10;
  length: number = 0;
  searchName: string = "";
  isReady: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public IngredientService: IngredientService) { }

  ngOnInit() {
    this.getIngredients(this.searchName, this.limit);
  }

  onDelete(ingredient: Ingredient) {
    if (this.clickMethod(ingredient.name)) {
      this.IngredientService.deleteIngredient(ingredient._id)
      .subscribe(() => {
        this.getIngredients(this.searchName, this.limit);
      });
    }
  }

  getIngredientsData(event?: PageEvent) {
    this.getIngredients(this.searchName, this.limit);
  }

  search(event: any){
    this.searchName = event.target.value;
    this.getIngredients(this.searchName, this.limit);
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }

  getIngredients(searchName: string, limit: number){
    this.isReady = false;
    this.IngredientService.getIngredients(searchName, limit)
      .subscribe((fetchedData) => {
        this.ingredients = fetchedData.ingredients;
        this.isReady = true;
      });
  }

  changeLimit(limit: number){
    this.limit = limit;
    this.getIngredients(this.searchName, this.limit);
  }
}
