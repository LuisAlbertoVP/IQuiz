import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AulaService } from '@aula_service/*';
import { Asignacion, Curso } from '@models/aula';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-aula-calificaciones',
  templateUrl: './aula-calificaciones.component.html',
  styleUrls: ['./aula-calificaciones.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AulaCalificacionesComponent implements OnInit {
  @Input() curso: Curso;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  columnsToDisplay: string[] = ['tema', 'fecha', 'instrucciones'];
  dataSource: MatTableDataSource<Asignacion>;

  constructor(
    private service: AulaService
  ) { }

  ngOnInit(): void {
    this.service.getCursoPruebas(this.curso.id).subscribe(asignaciones => {
      this.dataSource = new MatTableDataSource(asignaciones);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
