import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from '../angular-material.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InstructionCreateComponent } from './create/instruction-create.component';
import { InstructionListComponent } from './list/instruction-list.component';

@NgModule({
    declarations: [
        InstructionCreateComponent,
        InstructionListComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class InstructionModule {}