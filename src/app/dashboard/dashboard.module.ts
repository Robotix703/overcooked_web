import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from '../angular-material.component';

import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule
    ]
})
export class DashboardModule {}
