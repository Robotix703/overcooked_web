import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IngredientService } from '../ingredient.service';
import { categories, Ingredient, unitOfMeasures } from "../ingredient.model";

@Component({
  selector: 'app-ingredient-create',
  templateUrl: './ingredient-create.component.html',
  styleUrls: ['./ingredient-create.component.css']
})

export class IngredientCreateComponent implements OnInit {

  formulaire: FormGroup = new FormGroup({});

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
              imageUrl: "",
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
      imageUrl: new FormControl(null, {
        validators: [Validators.required]
      }),
      freezable: new FormControl(null, {
        validators: []
      })
    });
  }

  async onSavePost() {
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
          this.formulaire.value.imageUrl,
          this.formulaire.value.unitOfMeasure,
          this.formulaire.value.shelfLife,
          this.formulaire.value.freezable ? this.formulaire.value.freezable : false
        );
      }
    })
  }
}
