import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from '../angular-material.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RecipeCreateComponent } from "./create/recipe-create.component";
import { RecipeListComponent } from './list/recipe-list.component';
import { RecipeDisplayComponent } from './display/recipe-display.component';

@NgModule({
    declarations: [
        RecipeCreateComponent,
        RecipeListComponent,
        RecipeDisplayComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class RecipeModule {}