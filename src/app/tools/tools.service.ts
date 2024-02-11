import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { fetchedData } from "./tools.module";


const URL_BACKEND = environment.apiURL + "tools/";

@Injectable({ providedIn: 'root' })

export class ToolsService {

    constructor(private http: HttpClient, private router: Router) { }

    getDataFromMarmiton(url: string): Observable<fetchedData> {
        return this.http.get<fetchedData>(URL_BACKEND + `extractFromMarmiton?url=${url}`);
    }
}