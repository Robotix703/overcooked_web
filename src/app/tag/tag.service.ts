import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tag } from './tag.model';

const URL_BACKEND = environment.apiURL + "tag/";

@Injectable({ providedIn: 'root' })

export class TagService {

  constructor(private http: HttpClient) { }

  createTag(name: string, color: string, path: string){

  }

  getTags(){
    return this.http.get<Tag[]>(URL_BACKEND);
  }
}
