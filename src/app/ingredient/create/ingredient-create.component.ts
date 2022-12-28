import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IngredientService } from '../ingredient.service';
import { categories, Ingredient, unitOfMeasures } from "../ingredient.model";

import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-ingredient-create',
  templateUrl: './ingredient-create.component.html',
  styleUrls: ['./ingredient-create.component.css']
})

export class IngredientCreateComponent implements OnInit {

  formulaire: FormGroup = new FormGroup({});
  imagePreview: string = "";

  ingredientCategories = categories;
  ingredientUnitOfMeasures = unitOfMeasures;

  editMode: boolean = false;
  ingredientID: string = "";

  constructor(public IngredientService: IngredientService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("ingredientID")) {
        this.editMode = true;
        this.ingredientID = paramMap.get('ingredientID') || "";

        this.IngredientService.getIngredientByID(this.ingredientID)
          .subscribe((result: Ingredient) => {
            this.formulaire.setValue({
              name: result.name,
              consumable: result.consumable,
              unitOfMeasure: result.unitOfMeasure,
              image: result.imagePath,
              shelfLife: result.shelfLife ?? null,
              freezable: result.freezable
            });
          });
      }
    });

    this.formulaire = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      consumable: new FormControl(null, {
        validators: []
      }),
      unitOfMeasure: new FormControl(null, {
        validators: [Validators.required]
      }),
      shelfLife: new FormControl(null, {
        validators: []
      }),
      image: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      }),
      freezable: new FormControl(null, {
        validators: []
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

  async onSavePost() {
    console.log(this.formulaire.invalid)
    if (this.formulaire.invalid) return;

    this.IngredientService.duplicateIngredientCheck(this.formulaire.value.name).subscribe((isDuplicate: boolean) => {

      if(isDuplicate && !this.editMode) {
        alert("L'ingrédient existe déjà");
        return;
      }

      if (this.editMode) {
        this.IngredientService.updateIngredient(
          this.ingredientID,
          this.formulaire.value.name,
          this.formulaire.value.consumable ? this.formulaire.value.consumable : false,
          this.formulaire.value.unitOfMeasure,
          this.formulaire.value.shelfLife,
          this.formulaire.value.freezable ? this.formulaire.value.freezable : false
        )
      } else {
        this.IngredientService.addIngredient(
          this.formulaire.value.name,
          this.formulaire.value.consumable ? this.formulaire.value.consumable : false,
          this.formulaire.value.image,
          this.formulaire.value.unitOfMeasure,
          this.formulaire.value.shelfLife,
          this.formulaire.value.freezable ? this.formulaire.value.freezable : false
        );
      }
    })
  }
}
