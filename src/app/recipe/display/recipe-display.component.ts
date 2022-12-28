import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { Ingredient } from 'src/app/ingredient/ingredient.model';
import { PrettyRecipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
    selector: 'app-recipe-display',
    templateUrl: './recipe-display.component.html',
    styleUrls: ['./recipe-display.component.css']
})

export class RecipeDisplayComponent implements OnInit, OnDestroy {

    userIsAuthenticated = false;
    userId = null;

    prettyRecipeData: PrettyRecipe = {
        _id: "",
        title: "",
        numberOfLunch: 0,
        category: "",
        duration: 0,
        instructions: []
    };

    displayedColumns: string[] = ['name', 'quantity'];
    dataSource: any = [];
    ingredientListPart1: { ingredient: Ingredient, quantity: number }[] = [];
    ingredientListPart2: { ingredient: Ingredient, quantity: number }[] = [];
    ingredientListPart3: { ingredient: Ingredient, quantity: number }[] = [];

    private authStatusSub: Subscription = new Subscription();

    constructor(private recipeService: RecipeService, private authService: AuthService, public route: ActivatedRoute) { }

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has("recipeID")) {
                let recipeID = paramMap.get('recipeID') || "";

                this.recipeService.getPrettyRecipe(recipeID)
                    .subscribe((result) => {
                        this.prettyRecipeData = result;

                        for (let instruction of this.prettyRecipeData.instructions) {
                            this.dataSource = instruction.composition;
                        }
                    });

                this.recipeService.getIngredientListForRecipe(recipeID)
                    .subscribe((result) => {
                        this.splitIngredientList(result);
                    })
            }

            if (paramMap.has("mealID")) {
                let mealID = paramMap.get('mealID') || "";

                this.recipeService.getPrettyRecipe("", mealID)
                    .subscribe((result) => {
                        this.prettyRecipeData = result;

                        for (let instruction of this.prettyRecipeData.instructions) {
                            this.dataSource = instruction.composition;
                        }
                    });

                this.recipeService.getIngredientListForRecipe("", mealID)
                    .subscribe((result) => {
                        this.splitIngredientList(result);
                    });
            }
        });
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }

    splitIngredientList(ingredientListFetch: { ingredient: Ingredient, quantity: number }[]) {
        this.ingredientListPart1 = ingredientListFetch.slice(0, 3);
        this.ingredientListPart2 = ingredientListFetch.slice(4, 7);
        this.ingredientListPart3 = ingredientListFetch.slice(8, 11);
    }
}
