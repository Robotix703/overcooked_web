import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

import { IngredientInventory, Pantry } from "./pantry.model";

const URL_BACKEND = environment.apiURL + "pantry/";

@Injectable({ providedIn: 'root' })

export class PantryService {
  constructor(private http: HttpClient, private router: Router) { }

  getIngredientInventory() {
    return this.http.get<IngredientInventory[]>(URL_BACKEND + "fullPantryInventory");
  }

  deletePantry(pantryID: string) {
    return this.http.delete(URL_BACKEND + pantryID);
  }

  createPantry(ingredientName: string, quantity: number, expirationDate: Date | null) {
    this.http.post<Pantry>(URL_BACKEND + "createByIngredientName",
      {
        ingredientName: ingredientName,
        quantity: quantity.toString(),
        expirationDate: expirationDate?.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })
      })
      .subscribe((responseData: Pantry) => {
        this.router.navigate(["/pantry"]);
      });
  }

  getPantryByID(pantryID: string) {
    return this.http.get<{ _id: string, ingredientID: string, ingredientName: string, quantity: number, expirationDate: Date }>(URL_BACKEND + `/byID?pantryID=${pantryID}`);
  }

  refreshTodoist() {
    return this.http.post<{ result: string }>(URL_BACKEND + "refreshTodoist", {});
  }

  updatePantry(pantryID: string, ingredientName: string, quantity: number, expirationDate: Date | null) {
    this.http.put<string>(URL_BACKEND + pantryID, {
      ingredientName: ingredientName,
      quantity: quantity,
      expirationDate: expirationDate? new Date(expirationDate).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }) : null
    })
      .subscribe((result) => {
        this.router.navigate(["/pantry"]);
      })
  }
}
