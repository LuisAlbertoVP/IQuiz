import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { CuestionarioService }  from '@cuestionario_service/CuestionarioService';
import { Archivo } from '@models/file';
import { Repositorio } from '@models/repositorio';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cuestionario-list',
  templateUrl: './cuestionario-list.component.html'
})
export class CuestionarioListComponent implements OnInit, OnChanges {
  @Output() updateExtrasRequest = new EventEmitter<any>();
  @Input('data') archivos: Archivo[]; 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['select', 'img', 'nombre', 'fechaCreacion', 'fechaModificacion'];
  dataSource: MatTableDataSource<Archivo>;
  selection = new SelectionModel<Archivo>(true, []);
  clipboard: string[] = [];
  idParent: string;
  result: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private http: CuestionarioService
  ) { }

  ngOnInit(): void { 
    this.activatedRoute.paramMap.subscribe(params => this.idParent = params.get('id'));
  }

  ngOnChanges() {
    this.generateDataSource(this.archivos);
    if(this.clipboard?.length > 0) {
      const archivos = [];
      for(let i = 0; i < this.dataSource.data.length; i++) {
        archivos[this.dataSource.data[i].id] = this.dataSource.data[i];
      }
      for(let i = 0; i < this.clipboard.length; i++) {
        this.selection.select(archivos[this.clipboard[i]]);
      }
    }
  }

  private generateDataSource(archivos: Archivo[]) {
    this.dataSource = new MatTableDataSource(archivos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  nuevo(content: any) {
    this.modalService.open(content).result.then((result) => {
      const newIdArchivo = uuid();
      const nombre = result['nombre'] ? result['nombre'] : result['title'];
      const fecha = moment().format('YYYY-MM-DD h:mm:ss');
      const archivo: Archivo = { id: newIdArchivo, nombre: nombre, esCarpeta: result['esCarpeta'], fechaCreacion: fecha, fechaModificacion: fecha, parent_id: this.idParent };
      const cuestionario: Repositorio = { id: archivo.id, nombre: archivo.nombre, puntaje: 10, tiempo: { hour: 0, minute: 30 }, preguntas: []};
      forkJoin([
        this.http.addFile(archivo),
        this.http.addCuestionario(cuestionario)
      ]).subscribe(responses => {
        let ok = true;
        for(let i = 0; i < responses.length; i++) {
          if((responses[i] as HttpResponse<Object>).status != 200) {
            ok = false;
          }
        }
        if(ok) {
          this.dataSource.data.push(archivo);  
          this.generateDataSource(this.dataSource.data.sort((a,b) => a.nombre.localeCompare(b.nombre)));
        } else {
          if(archivo.esCarpeta) {
            this.snackBar.open('No se ha podido crear la carpeta', 'Error', { duration: 2000 });
          } else {
            this.snackBar.open('No se ha podido crear el cuestionario', 'Error', { duration: 2000 });
          }
        }
      });
    }, (reason) => {});
  }

  private idChecked(): string[] {
    let ids: string[] = [];
    for(let i = 0; i < this.selection.selected.length; i++) {
      ids.push(this.selection.selected[i].id);
    }
    return ids;
  }

  private verificarCheks(): boolean {
    if(this.selection.isEmpty()) {
      this.snackBar.open('No hay selecciones disponibles', 'Error', { duration: 2000 });
      return false;
    }
    return true;
  }

  private verificarMultiplesChecks(): boolean {
    if(this.selection.selected?.length > 1) {
      this.snackBar.open('Se han detectado multiples selecciones', 'Error', { duration: 2000 });
      return true;
    }
    return false;
  }

  editar(content: any) {
    if(this.verificarCheks()) {
      if(!this.verificarMultiplesChecks()) {
        this.modalService.open(content).result.then((result) => {
          if(result['nombre']) {
            const archivo = this.selection.selected[0];
            archivo.nombre = result['nombre'];
            archivo.fechaModificacion = moment().format('YYYY-MM-DD h:mm:ss');
            this.http.addFile(archivo).subscribe((response: HttpResponse<Object>) => {
              if(response.status == 200) {
                this.generateDataSource(this.dataSource.data.sort((a,b) => a.nombre.localeCompare(b.nombre)));
                this.selection.clear();  
              } else {
                this.snackBar.open('No se han guardado los cambios', 'Error', { duration: 2000 });
              }
            });
          } else {
            this.snackBar.open('No se han realizado cambios', 'Error', { duration: 2000 });
          }
        }, (reason) => {});
      }
    }
  }

  mover() {
    if(this.verificarCheks()) {
      this.clipboard = this.idChecked();
      this.updateExtrasRequest.emit({ cb: this.clipboard });
    }
  }

  cancelar() {
    this.clipboard = [];
    this.updateExtrasRequest.emit(null);
    this.selection.clear();
  }

  moverAqui() {
    const cb: string[] = this.activatedRoute.snapshot.queryParamMap.getAll('cb');
    if(cb.length > 0) {
      this.http.moveFiles(cb, this.idParent).subscribe((response: HttpResponse<Archivo[]>) => {
        if(response.status == 200) {
          this.generateDataSource(response.body.sort((a,b) => a.nombre.localeCompare(b.nombre)));
          this.clipboard = [];
          this.updateExtrasRequest.emit(null);
        } else {
          this.snackBar.open('No se han guardado los cambios', 'Error', { duration: 2000 });
        }
      });
    }
  }

  eliminar() {
    if(this.verificarCheks()) {
      this.http.deleteFile(this.idChecked()).subscribe((response: HttpResponse<Object>) => {
        if(response.status == 200) {
          this.selection.selected.forEach(archivo => {
            const index = this.dataSource.data.indexOf(archivo);
            this.dataSource.data.splice(index, 1);
          })
          this.generateDataSource(this.dataSource.data.sort((a,b) => a.nombre.localeCompare(b.nombre)));
          this.selection.clear();  
        } else {
          this.snackBar.open('No se han eliminado las selecciones', 'Error', { duration: 2000 });
        }
      });
    }
  }

  initPrueba() {
    if(this.verificarCheks()) {
      if(!this.verificarMultiplesChecks()) {
        if(!this.selection.selected[0].esCarpeta) {
          const cb: NavigationExtras = { queryParams: { cuestionario: this.selection.selected[0].id } };
          this.router.navigate(['/principal/prueba', uuid()], cb);
        } else {
          this.snackBar.open('No se puede iniciar prueba', 'Error', { duration: 2000 });
        }
      }
    }
  }

  isTheSameId(id: string) {
    for(let i = 0; i < this.clipboard.length; i++) {
      if(this.clipboard[i] == id) {
        return true;
      }
    }
    return false;
  }

  route(archivo: Archivo) {
    if(archivo.esCarpeta == true){
      if(this.clipboard.length > 0) {
        if(!this.isTheSameId(archivo.id)) {
          const cb: NavigationExtras = { queryParams: { cb: this.clipboard } };
          this.router.navigate(['/principal/cuestionarios', archivo.id], cb);
        } else {
          this.snackBar.open('No se puede mover aqui', 'Error', { duration: 2000 });
        }
      } else {
        this.router.navigate(['/principal/cuestionarios', archivo.id]);
      }
    } else {
      if(this.clipboard.length > 0) {
        this.snackBar.open('No se puede mover aqui', 'Error', { duration: 2000 });
      } else {
        this.router.navigate(['/principal/cuestionario', archivo.id ]);
      }
    }
  }
}
