import { NgModule } from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorIntlService } from './services/paginator-intl.service';

@NgModule({
  declarations: [ SidenavComponent ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    CommonModule,
    NgbModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    HttpClientModule,
    ReactiveFormsModule,
    SidenavComponent
  ],
  providers: [ { provide: MatPaginatorIntl, useClass: PaginatorIntlService} ]
})
export class SharedModule { }
