import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService }  from '../admin.service';
import { Curso } from '@models/aula';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-curso-list',
  templateUrl: './curso-list.component.html'
})
export class CursoListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['curso', 'materia', 'accion'];
  dataSource: MatTableDataSource<Curso>;
  curso = this.fb.group({
    id: [''],
    nombre: ['', Validators.required],
    materia: ['', Validators.required]
  });

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: AdminService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.service.getCursos().subscribe(cursos => {
      if(cursos?.length > 0) {
        this.generateDataSource(cursos);
      } else {
        this.generateDataSource([]);
        this.snackBar.open('No existen cursos','Error', { duration: 2000 });
      }
    });
  }

  private generateDataSource(cursos: Curso[]) {
    this.dataSource = new MatTableDataSource(cursos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fillForm = (curso: Curso) => this.curso.patchValue(curso);
  
  nuevo = (content: any) => this.modalService.open(content, { backdrop: 'static' });

  updateEstado(curso: Curso) {
    if(curso.estado == 1) {
      this.service.disabledCurso(curso.id).subscribe((response: HttpResponse<Object>) => {
        if(response.status == 200) {
          curso.estado = 0;
        } else {
          this.snackBar.open('No se ha desactivado el curso','Error', { duration: 2000 });
        }
      });
    } else {
      this.service.enabledCurso(curso.id).subscribe((response: HttpResponse<Object>) => {
        if(response.status == 200) {
          curso.estado = 1;
        } else {
          this.snackBar.open('No se ha activado el curso','Error', { duration: 2000 });
        }
      });
    }
  }

  onSubmit(form: NgForm) {
    if(this.curso.valid) {
      const curso: Curso = this.curso.getRawValue();
      if(!curso.id) {
        curso.id = uuid();
        curso.estado = 1;
      }
      this.service.addCurso(curso).subscribe((response: HttpResponse<Object>) => {
        if(response.status == 200) {
          let band: boolean = true;
          for(let i = 0; i < this.dataSource.data.length; i++) {
            if(this.dataSource.data[i].id == curso.id) {
              band = false;
              this.dataSource.data[i].nombre = curso.nombre;
              this.dataSource.data[i].materia = curso.materia;
            }
          }
          if(band) {
            this.dataSource.data.push(curso);
          }
          this.generateDataSource(this.dataSource.data.sort((a,b) => a.nombre.localeCompare(b.nombre)));
          this.modalService.dismissAll();
          form.resetForm();
          this.snackBar.open('Curso actualizado','Ok', { duration: 2000, panelClass: ['success'] });
        } else {
          this.snackBar.open('No se han guardado cambios','Error', { duration: 2000 });
        }
      });
    } else {
      this.snackBar.open('Algunos campos tienen errores','Error', { duration: 2000 });
    }
  }

  navigate = (url: string) => this.router.navigate([url]);
}
