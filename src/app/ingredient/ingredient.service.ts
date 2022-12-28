import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

import { Ingredient } from './ingredient.model';

const URL_BACKEND = environment.apiURL + "ingredient/";

@Injectable({ providedIn: 'root' })

export class IngredientService {

  constructor(private http: HttpClient, private router: Router) { }

  addIngredient(name: string, consumable: boolean, image: File, unitOfMeasure: string, shelfLife: number | null, freezable: boolean) {
    const ingredientData = new FormData();
    ingredientData.append("name", name);
    ingredientData.append("consumable", consumable.toString());
    ingredientData.append("image", image, name);
    ingredientData.append("unitOfMeasure", unitOfMeasure);
    ingredientData.append("shelfLife", shelfLife ? shelfLife.toString() : "");
    ingredientData.append("freezable", freezable.toString());

    this.http.post<Ingredient>(URL_BACKEND, ingredientData)
      .subscribe((responseData: Ingredient) => {
        this.router.navigate(["/ingredient"]);
      });
  }

  getIngredients(searchName: string, limit: number) {
    return this.http.get<{ ingredients: Ingredient[], count: number }>(URL_BACKEND + `?name=${searchName}&limit=${limit}`);
  }

  getIngredientsByName(name: string) {
    return this.http.get<{ ingredients: Ingredient[], count: number }>(URL_BACKEND + `name?name=${name}`);
  }

  getIngredientByID(ingredientID: string) {
    return this.http.get<Ingredient>(URL_BACKEND + `byID?ingredientID=${ingredientID}`);
  }

  deleteIngredient(ingredientID: string) {
    return this.http.delete(URL_BACKEND + ingredientID);
  }

  getAllIngredientsName() {
    return this.http.get<string[]>(URL_BACKEND + "allNames");
  }

  getAllIngredientsForAutocomplete() {
    return this.http.get<string[]>(URL_BACKEND + "forAutocomplete");
  }

  updateIngredient(ingredientID: string, name: string, consumable: boolean, unitOfMeasure: string, shelfLife: number | null, freezable: boolean) {
    this.http.put<string>(URL_BACKEND + ingredientID, {
      name: name,
      consumable: consumable,
      unitOfMeasure: unitOfMeasure,
      shelfLife: shelfLife,
      freezable: freezable
    })
      .subscribe((result: string) => {
        this.router.navigate(["/ingredient"]);
      })
  }

  duplicateIngredientCheck(ingredientName: string){
    return this.http.get<boolean>(URL_BACKEND + `duplicatesCheck?name=${ingredientName}`);
  }
}
