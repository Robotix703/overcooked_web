import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

import { TodoItem } from "./todoItem.model";

const URL_BACKEND = environment.apiURL + "todoItem/";

@Injectable({ providedIn: 'root' })

export class TodoItemService {
  constructor(private http: HttpClient, private router: Router) { }

  getTodoItem() {
    return this.http.get<{ todoItems: TodoItem[], count: number }>(URL_BACKEND);
  }

  deleteTodoItem(todoItemID: string) {
    return this.http.delete(URL_BACKEND + todoItemID);
  }
}
