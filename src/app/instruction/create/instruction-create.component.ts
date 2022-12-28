import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

import { InstructionService } from '../instruction.service';
import { IngredientService } from 'src/app/ingredient/ingredient.service';
import { map, startWith } from 'rxjs/operators';
import { PrettyInstruction } from '../instruction.model';

@Component({
    selector: 'app-instruction-create',
    templateUrl: './instruction-create.component.html',
    styleUrls: ['./instruction-create.component.css']
})

export class InstructionCreateComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public InstructionService: InstructionService,
        public route: ActivatedRoute,
        public IngredientService: IngredientService
    ) { }

    productForm: FormGroup = new FormGroup({});
    ingredientAutoComplete = new FormControl();
    quantity = new FormControl();

    options: string[] = [];
    filteredOptions: Observable<string[]> = new Observable;

    recipeID: string = "";
    ingredients: { ingredientName: string, quantity: number }[] = [];

    editMode: boolean = false;
    instructionID: string = "";

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has("recipeID")) {
                this.recipeID = paramMap.get('recipeID') || "";

                if (this.recipeID) {
                    this.InstructionService.getInstructionCount(this.recipeID).subscribe((count) => {
                        this.productForm.setValue({
                            text: null,
                            cookingTime: null,
                            order: count + 1
                        })
                    });
                }
            }

            if (paramMap.has("instructionID")) {
                this.editMode = true;
                this.instructionID = paramMap.get('instructionID') || "";

                this.InstructionService.getPrettyInstruction(this.instructionID)
                    .subscribe((result: PrettyInstruction) => {
                        this.productForm.setValue({
                            text: result.text,
                            cookingTime: result.cookingTime ?? null,
                            order: result.order
                        });

                        this.recipeID = result.recipeID;

                        for (let i = 0; i < result.composition.length; i++) {
                            this.ingredients.push({
                                ingredientName: result.composition[i].name + " - " + result.composition[i].unitOfMeasure,
                                quantity: result.composition[i].quantity
                            });
                        }
                    });
            }
        });

        this.productForm = this.fb.group({
            text: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]
            }),
            cookingTime: new FormControl(null, {
                validators: []
            }),
            order: new FormControl(null, {
                validators: [Validators.required]
            })
        })

        this.IngredientService.getAllIngredientsForAutocomplete().subscribe((result) => {
            this.options = result;

            this.filteredOptions = this.ingredientAutoComplete.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value))
            );
        })
    }

    addIngredient() {
        if (this.ingredientAutoComplete.value && this.quantity.value) {
            this.ingredients.push({
                ingredientName: this.ingredientAutoComplete.value,
                quantity: this.quantity.value
            });
            this.productForm.setValue({
                text: this.productForm.value.text,
                cookingTime: this.productForm.value.cookingTime,
                order: this.productForm.value.order
            });
            this.ingredientAutoComplete.setValue("");
            this.quantity.setValue(null);
        }
    }

    deleteIngredient(ingredientName: string) {
        this.ingredients = this.ingredients.filter(e => e.ingredientName != ingredientName);
    }

    onSavePost() {
        if (this.productForm.invalid) return;

        let simpleIngredients = [...this.ingredients];
        simpleIngredients.forEach((part, index) => {
            simpleIngredients[index].ingredientName = part.ingredientName.split(" - ")[0];
        })

        if (this.editMode) {
            this.InstructionService.updateInstruction(
                this.instructionID,
                this.productForm.value.text,
                this.recipeID,
                simpleIngredients,
                this.productForm.value.order,
                this.productForm.value.cookingTime
            );
        } else {
            this.InstructionService.addInstruction(
                this.productForm.value.text,
                simpleIngredients,
                this.recipeID,
                this.productForm.value.order,
                this.productForm.value.cookingTime
            );
        }
    }
}