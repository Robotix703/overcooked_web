import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TagService } from '../tag.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.css']
})
export class TagCreateComponent implements OnInit {

  formulaire: FormGroup = new FormGroup({});
  imagePreview: string = "";

  constructor(private tagService: TagService) { }

  ngOnInit(): void {
    this.formulaire = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
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
    if (this.formulaire.invalid) return
    
    this.tagService.createTag(
      this.formulaire.value.name,
      this.formulaire.value.image
    ).subscribe(result => {
      console.log(result);
    })
  }
}
