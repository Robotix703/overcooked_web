import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { IngredientService } from 'src/app/ingredient/ingredient.service';
import { PantryService } from "../pantry.service";

@Component({
  selector: 'app-pantry-create',
  templateUrl: './pantry-create.component.html',
  styleUrls: ['./pantry-create.component.css']
})

export class PantryCreateComponent implements OnInit {

  formulaire: FormGroup = new FormGroup({});
  ingredientAutoComplete = new FormControl();

  options: string[] = [];
  filteredOptions: Observable<string[]> = new Observable;

  editMode: boolean = false;
  pantryID: string = "";

  constructor(public PantryService: PantryService, public route: ActivatedRoute, public IngredientService: IngredientService) { }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("ingredientID")) {
        let ingredientID = paramMap.get('ingredientID') || "";

        this.IngredientService.getIngredientByID(ingredientID).subscribe((result) => {
          this.formulaire.setValue({
            quantity: null,
            expirationDate: null,
            frozen: false
          });
          this.ingredientAutoComplete.setValue(result.name);
        });
      }

      if (paramMap.has("pantryID")) {
        this.editMode = true;
        this.pantryID = paramMap.get('pantryID') || "";

        this.PantryService.getPantryByID(this.pantryID).subscribe((result) => {
          this.formulaire.setValue({
            quantity: result.quantity,
            expirationDate: result.expirationDate,
            frozen: result.frozen ?? false
          });
          this.ingredientAutoComplete.setValue(result.ingredientName);
        });
      }
    });

    this.IngredientService.getAllIngredientsName().subscribe((result) => {
      this.options = result;

      this.filteredOptions = this.ingredientAutoComplete.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    })

    this.formulaire = new FormGroup({
      quantity: new FormControl(null, {
        validators: [Validators.required]
      }),
      expirationDate: new FormControl(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      frozen: new FormControl(null, {
        validators: []
      })
    });
  }

  onSavePantry() {
    if(!this.ingredientAutoComplete.value) return;

    if (this.editMode) {
      this.PantryService.updatePantry(
        this.pantryID,
        this.ingredientAutoComplete.value,
        this.formulaire.value.quantity,
        this.formulaire.value.expirationDate,
        this.formulaire.value.frozen
      )
    } else {
      this.PantryService.createPantry(
        this.ingredientAutoComplete.value,
        this.formulaire.value.quantity,
        this.formulaire.value.expirationDate,
        this.formulaire.value.frozen
      );
    }
  }
}
