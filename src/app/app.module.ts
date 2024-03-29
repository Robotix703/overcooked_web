import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material.component';

import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';

import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthModule } from './auth/auth.module';

//Import des composants
import { HeaderComponent } from './header/header.component';
import { IngredientModule } from './ingredient/ingredient.module';
import { InstructionModule } from './instruction/instruction.module';
import { RecipeModule } from './recipe/recipe.module';
import { PantryModule } from './pantry/pantry.module';
import { TodoItemModule } from './todoItem/todoItem.module';
import { TagModule } from './tag/tag.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    AuthModule,
    IngredientModule,
    InstructionModule,
    RecipeModule,
    PantryModule,
    TodoItemModule,
    TagModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
