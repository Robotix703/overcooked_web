import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCreateComponent } from './create/tag-create.component';
import { TagListComponent } from './list/tag-list.component';

@NgModule({
  declarations: [
    TagListComponent,
    TagCreateComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TagModule { }
