import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { TodoItem } from '../todoItem.model';
import { TodoItemService } from '../todoItem.service';

@Component({
  selector: 'app-todoItem-list',
  templateUrl: './todoItem-list.component.html',
  styleUrls: ['./todoItem-list.component.css']
})

export class TodoItemListComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  userId = null;
  isReady: boolean = false;

  todoItems: TodoItem[] = [];

  private authStatusSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    public TodoItemService: TodoItemService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.getTodoItems();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onDelete(todoItemID: string) {
    this.TodoItemService.deleteTodoItem(todoItemID)
      .subscribe((result) => {
        this.getTodoItems();
      })
  }

  getTodoItems() {
    this.isReady = false;
    this.TodoItemService.getTodoItem()
      .subscribe((result: { todoItems: TodoItem[], count: number }) => {
        this.todoItems = result.todoItems;
        this.isReady = true;
      });
  }
}
