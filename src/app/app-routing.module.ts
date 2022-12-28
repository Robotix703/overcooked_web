import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router"

import { AuthGuard } from './auth/auth.guard';

//Import des componsants
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { IngredientCreateComponent } from './ingredient/create/ingredient-create.component';
import { IngredientListComponent } from './ingredient/list/ingredient-list.component';
import { InstructionCreateComponent } from './instruction/create/instruction-create.component';
import { RecipeCreateComponent } from './recipe/create/recipe-create.component';
import { RecipeListComponent } from './recipe/list/recipe-list.component';
import { InstructionListComponent } from './instruction/list/instruction-list.component';
import { MealListComponent } from './meal/list/meal-list.component';
import { PantryListComponent } from './pantry/list/pantry-list.component';
import { PantryCreateComponent } from './pantry/create/pantry-create.component';
import { TodoItemListComponent } from './todoItem/list/todoItem-list.component';
import { RecipeDisplayComponent } from './recipe/display/recipe-display.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'auth',
    children: [
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'signup', component: SignupComponent
      }
    ]
  },
  {
    path: 'ingredient',
    children: [
      {
        path: 'create', component: IngredientCreateComponent
      },
      {
        path: '', component: IngredientListComponent
      },
      {
        path: 'edit/:ingredientID', component: IngredientCreateComponent
      }
    ]
  },
  {
    path: 'instruction',
    children: [
      {
        path: 'create/:recipeID', component: InstructionCreateComponent
      },
      {
        path: 'list/:recipeID', component: InstructionListComponent
      },
      {
        path: 'edit/:instructionID', component: InstructionCreateComponent
      }
    ]
  },
  {
    path: 'recipe',
    children: [
      {
        path: 'create', component: RecipeCreateComponent
      },
      {
        path: '', component: RecipeListComponent
      },
      {
        path: 'edit/:recipeID', component: RecipeCreateComponent
      },
      {
        path: 'display/:recipeID', component: RecipeDisplayComponent
      },
      {
        path: 'displayMeal/:mealID', component: RecipeDisplayComponent
      }
    ]
  },
  {
    path: 'meal',
    children: [
      {
        path: '', component: MealListComponent
      }
    ]
  },
  {
    path: 'pantry',
    children: [
      {
        path: '', component: PantryListComponent
      },
      {
        path: 'create/:ingredientID', component: PantryCreateComponent
      },
      {
        path: 'create', component: PantryCreateComponent
      },
      {
        path: 'edit/:pantryID', component: PantryCreateComponent
      }
    ]
  },
  {
    path: 'todoItem',
    children: [
      {
        path: '', component: TodoItemListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
