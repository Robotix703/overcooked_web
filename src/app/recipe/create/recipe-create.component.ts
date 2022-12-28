import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from "./mime-type.validator";

import { RecipeService } from "../recipe.service"
import { categoriesRecipe, Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})

export class RecipeCreateComponent implements OnInit {

  categoriesRecipe = categoriesRecipe;

  formulaire: FormGroup = new FormGroup({});
  imagePreview: string = "";
  editMode: boolean = false;
  recipeID: string = "";

  constructor(public RecipeService: RecipeService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("recipeID")) {
        this.editMode = true;
        this.recipeID = paramMap.get('recipeID') || "";
        this.RecipeService.getRecipe(this.recipeID).subscribe((recipe: Recipe) => {
          this.formulaire.setValue({
            title: recipe.title,
            numberOfLunch: recipe.numberOfLunch,
            image: recipe.imagePath,
            category: recipe.category,
            duration: recipe.duration
          });
        });
      }
    });

    this.formulaire = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      numberOfLunch: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
      category: new FormControl(null, {
        validators: [Validators.required]
      }),
      duration: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      })
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();

    this.formulaire.patchValue({ image: file });
    this.formulaire.get('image')!.updateValueAndValidity();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.formulaire.invalid) return;

    if (this.editMode) {
      this.RecipeService.updateRecipe(
        this.recipeID,
        this.formulaire.value.title,
        this.formulaire.value.numberOfLunch,
        this.formulaire.value.category,
        this.formulaire.value.duration);
    } else {
      this.RecipeService.addRecipe(
        this.formulaire.value.title,
        this.formulaire.value.numberOfLunch,
        this.formulaire.value.image,
        this.formulaire.value.category,
        this.formulaire.value.duration);
    }
  }
}
