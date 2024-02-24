import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tag } from './tag.model';

const URL_BACKEND = environment.apiURL + "tag/";

@Injectable({ providedIn: 'root' })

export class TagService {

  constructor(private http: HttpClient) { }

  createTag(name: string, image: string){
    const tagData = new FormData();
    tagData.append("name", name);
    tagData.append("image", new Blob([image]), name);

    return this.http.post<Tag>(URL_BACKEND, tagData);
  }

  getTags(){
    return this.http.get<Tag[]>(URL_BACKEND);
  }

  deleteTag(tagId: string){
    return this.http.delete<any>(URL_BACKEND + tagId);
  }
}
