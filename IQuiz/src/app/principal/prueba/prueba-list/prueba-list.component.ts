import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '@shared_service/shared';
import { PruebaService } from '@prueba_service/PruebaService';
import { Repositorio } from '@models/repositorio';

@Component({
  selector: 'app-prueba-list',
  templateUrl: './prueba-list.component.html',
  providers: [ PruebaService ]
})
export class PruebaListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['nombre', 'duracion', 'nota', 'puntaje', 'fecha', 'materia'];
  dataSource: MatTableDataSource<Repositorio>;

  constructor(
    sharedService: SharedService,
    private router: Router,
    private http: PruebaService
  ) { 
    sharedService.changeTitle('Pruebas');
  }

  ngOnInit(): void {
    this.http.getPruebas().subscribe(pruebas => {
      if(pruebas?.length > 0) {
        pruebas.forEach(prueba => prueba.duracion = prueba.tiempo.hour + ':' + prueba.tiempo.minute);
        this.generateDataSource(pruebas);
      } else {
        this.generateDataSource([]);
      }
    });
  }

  private generateDataSource(pruebas: Repositorio[]) {
    this.dataSource = new MatTableDataSource(pruebas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  navigate = (id: string) => this.router.navigate(['/principal/prueba', id]);
}