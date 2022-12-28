import { Component, Injectable } from '@angular/core'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

@Injectable({ providedIn: "root" })

export class DashboardComponent {  
  
    constructor() { }
}