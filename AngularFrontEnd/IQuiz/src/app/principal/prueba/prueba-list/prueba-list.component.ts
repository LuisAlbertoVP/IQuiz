import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PruebaService } from '@prueba_service/PruebaService';
import { Repositorio } from '@models/repositorio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prueba-list',
  templateUrl: './prueba-list.component.html',
  providers: [ PruebaService ]
})
export class PruebaListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['nombre', 'duracion', 'nota', 'puntaje', 'fecha'];
  dataSource: MatTableDataSource<Repositorio>;

  constructor(
    private router: Router,
    private http: PruebaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.http.getPruebas().subscribe(pruebas => {
      if(pruebas?.length > 0) {
        pruebas.forEach(prueba => prueba.duracion = prueba.tiempo.hour + ':' + prueba.tiempo.minute);
        this.dataSource = new MatTableDataSource(pruebas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.snackBar.open('No existen pruebas', 'Error', { duration: 2000 });
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  navigate = (id: string) => this.router.navigate(['/principal/prueba', id]);
}