import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL_BACKEND = environment.apiURL + "tags/";

@Injectable({ providedIn: 'root' })

export class TagService {

  constructor(private http: HttpClient) { }

  createTag(name: string, color: string, path: string){
    
  }
}
