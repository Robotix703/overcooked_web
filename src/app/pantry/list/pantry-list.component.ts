import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Pantry, IngredientInventory } from '../pantry.model';
import { PantryService } from "../pantry.service";

@Component({
  selector: 'app-pantry-list',
  templateUrl: './pantry-list.component.html',
  styleUrls: ['./pantry-list.component.css']
})

export class PantryListComponent implements OnInit, OnDestroy {
  inventory: IngredientInventory[] = [];

  userIsAuthenticated = false;
  userId = null;
  isReady: boolean = false;

  private authStatusSub: Subscription = new Subscription();

  constructor(private authService: AuthService, public PantryService: PantryService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.getIngredientInventory();

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  deletePantry(pantry: Pantry) {
    this.PantryService.deletePantry(pantry._id).subscribe((result) => {
      this.getIngredientInventory();
    });
  }

  getIngredientInventory() {
    this.isReady = false;
    this.PantryService.getIngredientInventory().subscribe((inventory: IngredientInventory[]) => {
      this.inventory = inventory;
      this.isReady = true;
    });
  }

  freezePantry(pantryID: string) {
    this.PantryService.freezePantry(pantryID)
      .subscribe(() => {
        this.getIngredientInventory();
      });
  }

  refreshTodoist() {
    this.PantryService.refreshTodoist()
      .subscribe(() => {
        this.getIngredientInventory();
      })
  }

  buyAgain(ingredientID: string, ingredientName: string, quantity: number, pantryID: string) {
    this.PantryService.buyAgain(ingredientID, ingredientName, quantity, pantryID).subscribe((result) => {
      this.getIngredientInventory();
    });
  }
}
