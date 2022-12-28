import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

import { Meal, PrettyMeal, stateMeal } from "./meal.model";

const URL_BACKEND = environment.apiURL + "meal/";

@Injectable({ providedIn: 'root' })

export class MealService {
  constructor(private http: HttpClient, private router: Router) { }

  createMeal(recipeID: string, numberOfLunchPlanned: number, callback?: Function) {
    this.http.post<Meal>(URL_BACKEND, { recipeID: recipeID, numberOfLunchPlanned: numberOfLunchPlanned.toString() })
      .subscribe((responseData: Meal) => {
        if(!callback) this.router.navigate(["/meal"]);
        else callback();
      });
  }

  getMeals(pageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    return this.http.get<{ meals: Meal[], count: number }>(URL_BACKEND + queryParams);
  }

  getMealsDisplayable() {
    return this.http.get<stateMeal[]>(URL_BACKEND + "displayable");
  }

  consumeMeal(mealID: string) {
    return this.http.post<{ status: string }>(URL_BACKEND + "consume", { mealID: mealID });
  }

  delete(mealID: string) {
    return this.http.delete(URL_BACKEND + mealID);
  }

  setHighPrio(mealID: string) {
    return this.http.post<{ status: string }>(URL_BACKEND + "setHighPrio", { mealID: mealID });
  }
}
