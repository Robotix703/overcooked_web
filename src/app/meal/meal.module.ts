import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from '../angular-material.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MealListComponent } from './list/meal-list.component';

@NgModule({
    declarations: [
        MealListComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class MealModule {}
