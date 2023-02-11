import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from "./mime-type.validator";

import { RecipeService } from "../recipe.service"
import { categoriesRecipe, Recipe } from '../recipe.model';
import { TagService } from 'src/app/tag/tag.service';
import { Tag } from 'src/app/tag/tag.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

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

  tags: Tag[] = [];
  tagsName: string[] = [];
  selectedTags: string[] = [];
  filteredTags: Observable<string[]> = new Observable;

  tagLoaded: boolean = false;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(public RecipeService: RecipeService, public route: ActivatedRoute, private tagService: TagService) { 
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
            this.formulaire.setValue({
              title: recipe.title,
              numberOfLunch: recipe.numberOfLunch,
              image: recipe.imagePath,
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

    let tagsId: string[] = [];
    for(let i = 0 ; i < this.selectedTags.length ; i++)
    {
      tagsId.push(this.tags[this.tags.findIndex(o => o.name === this.selectedTags[i])]._id);
    }

    if (this.editMode) {
      this.RecipeService.updateRecipe(
        this.recipeID,
        this.formulaire.value.title,
        this.formulaire.value.numberOfLunch,
        this.formulaire.value.category,
        this.formulaire.value.duration,
        tagsId);
    } else {
      this.RecipeService.addRecipe(
        this.formulaire.value.title,
        this.formulaire.value.numberOfLunch,
        this.formulaire.value.image,
        this.formulaire.value.category,
        this.formulaire.value.duration,
        tagsId);
    }
  }
}
