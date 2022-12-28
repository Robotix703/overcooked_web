import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { PrettyMeal, stateMeal } from '../meal.model';
import { MealService } from "../meal.service";

@Component({
  selector: 'app-meal-list',
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.css']
})

export class MealListComponent implements OnInit, OnDestroy {

  meals: PrettyMeal[] = [];

  userIsAuthenticated = false;
  userId = null;

  isReady: boolean = false;

  private authStatusSub: Subscription = new Subscription();

  constructor(private authService: AuthService, public MealService: MealService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.getMeals();

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  displayMeals(meals: PrettyMeal[]) {
    this.meals = (meals) ? meals : [];
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  consume(mealID: string) {
    this.MealService.consumeMeal(mealID).subscribe((result) => {
      this.getMeals();
    });
  }

  delete(mealID: string){
    this.MealService.delete(mealID).subscribe((result) => {
      this.getMeals();
    });
  }

  setHighPrio(mealID: string){
    this.MealService.setHighPrio(mealID).subscribe((result) => {
      this.getMeals();
    });
  }

  getMeals() {
    this.isReady = false;
    this.MealService.getMealsDisplayable()
      .subscribe((data: stateMeal[]) => {
        let mealToDisplay: PrettyMeal[] = data.map(meal => {
          let missingIngredient: {
            ingredientName: string,
            quantity: number,
            unitOfMeasure: string
          }[] = [];

          if (meal.state.ingredientUnavailable.length > 0) {
            meal.state.ingredientUnavailable.forEach((element: any) => {
              missingIngredient.push({
                ingredientName: element.ingredient.name,
                quantity: element.quantity,
                unitOfMeasure: element.ingredient.unitOfMeasure
              })
            });
          }

          return {
            _id: meal._id,
            title: meal.title,
            numberOfLunch: meal.numberOfLunch,
            imagePath: meal.imagePath,
            state: !(meal.state.ingredientUnavailable.length > 0),
            background: !(meal.state.ingredientUnavailable.length > 0) ? "#18af00" : "#af0800",
            missingIngredients: missingIngredient
          }
        })
        this.displayMeals(mealToDisplay);
        this.isReady = true;
      });
  }
}
