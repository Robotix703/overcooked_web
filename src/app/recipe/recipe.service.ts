import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

import { PrettyRecipe, Recipe } from './recipe.model';
import { Ingredient } from '../ingredient/ingredient.model';

const URL_BACKEND = environment.apiURL + "recipe/";

@Injectable({ providedIn: 'root' })

export class RecipeService {

  constructor(private http: HttpClient, private router: Router) { }

  addRecipe(title: string, numberOfLunch: number, image: File, category: string, duration: number) {
    const recipeData = new FormData();
    recipeData.append("title", title);
    recipeData.append("numberOfLunch", numberOfLunch.toString());
    recipeData.append("image", image, title);
    recipeData.append("category", category);
    recipeData.append("duration", duration.toString());

    this.http.post<{id: string, recipe: Recipe}>(URL_BACKEND, recipeData)
      .subscribe((responseData: {id: string, recipe: Recipe}) => {
        this.router.navigate(["/instruction/list/" + responseData.recipe._id]);
      });
  }

  deleteRecipe(recipeID: string) {
    return this.http.delete(URL_BACKEND + recipeID);
  }

  getRecipe(recipeID: string) {
    return this.http.get<Recipe>(URL_BACKEND + "/byID?recipeID=" + recipeID);
  }

  getFilteredRecipe(category: string, name: string, pageSize: number, currentPage: number) {
    return this.http.get<{ recipes: any, count: number }>(URL_BACKEND + `/filter?category=${category}&name=${name}&pageSize=${pageSize}&currentPage=${currentPage + 1}`);
  }

  updateRecipe(recipeID: string, title: string, numberOfLunch: number, category: string, duration: number) {
    this.http.put<string>(URL_BACKEND + recipeID, {
      title: title,
      numberOfLunch: numberOfLunch,
      category: category,
      duration: duration
    })
      .subscribe((result) => {
        this.router.navigate(["/recipe"]);
      })
  }

  getPrettyRecipe(recipeID: string = "", mealID: string = "") {
    return this.http.get<PrettyRecipe>(URL_BACKEND + `/prettyRecipe?recipeID=${recipeID}&mealID=${mealID}`);
  }

  getIngredientListForRecipe(recipeID: string = "", mealID: string = "") {
    return this.http.get<{ ingredient: Ingredient, quantity: number }[]>(URL_BACKEND + `/ingredientNeeded?recipeID=${recipeID}&mealID=${mealID}`);
  }
}
