import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from '../angular-material.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PantryListComponent } from './list/pantry-list.component';
import { PantryCreateComponent } from './create/pantry-create.component';

@NgModule({
    declarations: [
        PantryListComponent,
        PantryCreateComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class PantryModule {}