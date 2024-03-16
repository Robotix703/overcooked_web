import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { RecipeService } from "../recipe.service"
import { ToolsService } from '../../tools/tools.service';
import { categoriesRecipe, Recipe } from '../recipe.model';
import { TagService } from 'src/app/tag/tag.service';
import { Tag } from 'src/app/tag/tag.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable } from 'rxjs';
import { fetchedData } from 'src/app/tools/tools.module';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { PrettyInstruction } from 'src/app/instruction/instruction.model';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})

export class RecipeCreateComponent implements OnInit {

  categoriesRecipe = categoriesRecipe;

  marmitonLink: string = "";

  recipeInfos: FormGroup = new FormGroup({});
  editMode: boolean = false;
  recipeID: string = "";

  tags: Tag[] = [];
  tagsName: string[] = [];
  selectedTags: string[] = [];
  filteredTags: Observable<string[]> = new Observable;

  tagLoaded: boolean = false;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();

  instructions: PrettyInstruction[] = [];
  instructionText: string[] = [];
  instructionOrder: number[] = [];
  
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(
    public RecipeService: RecipeService,
    public route: ActivatedRoute,
    private tagService: TagService,
    private ToolsService: ToolsService) { 
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
      this.tagsName = data.map(e => e.name);
      this.tags = data;
      this.tagLoaded = true;

      this.filteredTags = this.tagCtrl.valueChanges.pipe(
        map((tagName: string | null) => tagName ? this._filter(tagName) : this.tagsName.slice())
      );

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has("recipeID")) {
          this.editMode = true;
          this.recipeID = paramMap.get('recipeID') || "";
          this.RecipeService.getRecipe(this.recipeID).subscribe((recipe: Recipe) => {
            this.recipeInfos.setValue({
              title: recipe.title,
              numberOfLunch: recipe.numberOfLunch,
              imageUrl: "",
              category: recipe.category,
              duration: recipe.duration
            });

            for(let tag of recipe.tags){
              let tagName = this.tags.find(e => e._id === tag)?.name;
              if(tagName) this.selectedTags.push(tagName);
            }
          });
        }
      });
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
    console.log(this.instructions);

    if (this.recipeInfos.invalid) return;

    let tagsId: string[] = [];
    for(let i = 0 ; i < this.selectedTags.length ; i++)
    {
      tagsId.push(this.tags[this.tags.findIndex(o => o.name === this.selectedTags[i])]._id);
    }
    console.log(this.recipeInfos.value);
    
    /*
    if (this.editMode) {
      this.RecipeService.updateRecipe(
        this.recipeID,
        this.recipeInfos.value.title,
        this.recipeInfos.value.numberOfLunch,
        this.recipeInfos.value.category,
        this.recipeInfos.value.duration,
        tagsId);
    } else {
      this.RecipeService.addRecipe(
        this.recipeInfos.value.title,
        this.recipeInfos.value.numberOfLunch,
        this.recipeInfos.value.imageUrl,
        this.recipeInfos.value.category,
        this.recipeInfos.value.duration,
        tagsId);
    }
    */
  }

  addInstruction() {
    this.instructions.push({
      _id: "",
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

  onGetRecipeFromMarmiton(){
    this.ToolsService.getDataFromMarmiton(this.marmitonLink)
    .subscribe((data: fetchedData) => {
      if(!data) return;
      
      this.recipeInfos.setValue({
        title: data.title,
        numberOfLunch: data.numberOfLunch,
        imageUrl: data.imageSRC,
        duration: data.duration,
        category: categoriesRecipe[1]
      });
    });
  }

  addLink(event: any){
    this.marmitonLink = event.target.value;
  }
}
