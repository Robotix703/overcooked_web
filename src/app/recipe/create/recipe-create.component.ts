import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { RecipeService } from "../recipe.service"
import { IngredientService } from "../../ingredient/ingredient.service";
import { categoriesRecipe, PrettyRecipe, Recipe } from '../recipe.model';
import { TagService } from 'src/app/tag/tag.service';
import { Tag } from 'src/app/tag/tag.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { PrettyInstruction } from 'src/app/instruction/instruction.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})

export class RecipeCreateComponent implements OnInit {

  categoriesRecipe = categoriesRecipe;

  recipeInfos: FormGroup = new FormGroup({});
  editMode: boolean = false;
  recipeID: string = "";

  tags: Tag[] = [];
  tagsName: string[] = [];
  selectedTags: string[] = [];
  filteredTags: Observable<string[]> = new Observable;

  filteredIngredientName: Observable<string[]> = new Observable;

  tagLoaded: boolean = false;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();

  instructions: PrettyInstruction[] = [];
  instructionText: string[] = [];
  instructionOrder: number[] = [];
  
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(
    public RecipeService: RecipeService,
    public route: ActivatedRoute,
    private tagService: TagService,
    private IngredientService: IngredientService) { 
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      map((tagName: string | null) => tagName ? this._filter(tagName) : this.tagsName.slice()));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.tagsName.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) this.selectedTags.push(value.trim());
    if (input) input.value = '';

    this.tagCtrl.setValue(null);
  }

  remove(tagName: string): void {
    const index = this.selectedTags.indexOf(tagName);

    if (index >= 0) this.selectedTags.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  ngOnInit() {
    this.tagService.getTags().subscribe(data => {
      this.filteredTags = of(data.map(e => e.name));
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("recipeID")) {
        this.editMode = true;
        this.recipeID = paramMap.get('recipeID') || "";

        //Header & Instructions
        this.RecipeService.getPrettyRecipe(this.recipeID).subscribe((recipe: PrettyRecipe) => {
          this.recipeInfos.setValue({
            title: recipe.title,
            numberOfLunch: recipe.numberOfLunch,
            imageUrl: "",
            category: recipe.category,
            duration: recipe.duration
          });

          this.instructions = recipe.instructions;
        });
      }
    });

    this.IngredientService.getAllIngredientsName().subscribe(data => {
      this.filteredIngredientName = of(data);
    }); 

    this.recipeInfos = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      numberOfLunch: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      }),
      imageUrl: new FormControl(null, { 
        validators: []
      }),
      category: new FormControl(null, {
        validators: [Validators.required]
      }),
      duration: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      })
    });
  }

  onSubmit() {
    if (this.recipeInfos.invalid) return;

    let tagsId: string[] = [];
    for(let i = 0 ; i < this.selectedTags.length ; i++)
    {
      tagsId.push(this.tags[this.tags.findIndex(o => o.name === this.selectedTags[i])]._id);
    }
    
    if (this.editMode) {
      this.RecipeService.updateCompleteRecipe(
        this.recipeID,
        this.recipeInfos.value.title,
        this.recipeInfos.value.numberOfLunch,
        this.recipeInfos.value.imageUrl,
        this.recipeInfos.value.category,
        this.recipeInfos.value.duration,
        tagsId,
        this.instructions);
    } else {
      this.RecipeService.addCompleteRecipe(
        this.recipeInfos.value.title,
        this.recipeInfos.value.numberOfLunch,
        this.recipeInfos.value.imageUrl,
        this.recipeInfos.value.category,
        this.recipeInfos.value.duration,
        tagsId,
        this.instructions);
    }
  }

  addInstruction() {
    this.instructions.push({
      _id: "NEW",
      text: "",
      recipeID: "",
      composition: [],
      order: this.instructions.length + 1
    });

    this.instructionOrder.push(this.instructions.length);
  }

  removeInstruction(instruction: PrettyInstruction) {
    this.instructions.splice(this.instructions.findIndex(e => e.text === instruction.text), 1);
  }

  addIngredient(index: number) {
    this.instructions[index].composition.push({
      name: "",
      imagePath: "",
      quantity: 0,
      unitOfMeasure: ""
    });
  }
}
