import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    exports: [
        MatToolbarModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatSidenavModule,
        MatGridListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatSelectModule,
        MatDialogModule,
        MatListModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule
    ]
})

export class AngularMaterialModule {}
