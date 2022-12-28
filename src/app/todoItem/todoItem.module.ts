import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from '../angular-material.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TodoItemListComponent } from './list/todoItem-list.component'; 

@NgModule({
    declarations: [
        TodoItemListComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class TodoItemModule {}