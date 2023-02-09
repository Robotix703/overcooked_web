import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCreateComponent } from './create/tag-create.component';
import { TagListComponent } from './list/tag-list.component';
import { AngularMaterialModule } from '../angular-material.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TagListComponent,
    TagCreateComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class TagModule { }
