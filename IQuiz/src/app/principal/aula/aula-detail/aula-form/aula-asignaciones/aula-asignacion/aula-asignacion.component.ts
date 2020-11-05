import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CuestionarioService } from '@cuestionario_service/*';
import { AulaService } from '@aula_service/*';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Archivo } from '@models/file';
import { Asignacion, Cuestionario } from '@models/aula';
import { HttpResponse } from '@angular/common/http';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

@Component({
  selector: 'app-aula-asignacion',
  templateUrl: './aula-asignacion.component.html',
  styleUrls: ['./aula-asignacion.component.css']
})
export class AulaAsignacionComponent implements OnInit {
  @Output() removeAsignacionRequest = new EventEmitter<string>();
  @Input() archivos: Archivo[]; 
  @Input() asignacion: Asignacion;
  treeControl = new NestedTreeControl<Archivo>(node => node.archivos);
  dataSource = new MatTreeNestedDataSource<Archivo>();
  selectable: boolean = true;
  removable: boolean = true;
  curso: string;
  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cuestionarioService: CuestionarioService,
    private aulaService: AulaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.curso = params.get('curso');
      this.dataSource.data = this.archivos;
      this.form = this.toFormGroup(this.asignacion);
    });
  }

  private toFormGroup(asignacion: Asignacion) {
    let cuestionarios = [];
    for(let i = 0; i < asignacion.cuestionarios?.length; i++) {
      cuestionarios.push(this.fb.group({
        id: [asignacion.cuestionarios[i].id],
        nombre: [asignacion.cuestionarios[i].nombre],
        clave: [''],
        cuestionario_id: [asignacion.cuestionarios[i].cuestionario_id]
      }));
    }
    return this.fb.group({
      id: [asignacion.id],
      tema: [asignacion.tema, Validators.required],
      instrucciones: [asignacion.instrucciones],
      fecha: [moment(asignacion.fecha).toDate(), Validators.required],
      tiempo: [asignacion.tiempo, Validators.required],
      cuestionarios: this.fb.array(cuestionarios)
    });
  }
  
  get cuestionarios() {
    return this.form.get('cuestionarios') as FormArray;
  }

  private errorMessage = (message: string) => this.snackBar.open(message, 'Error', { duration: 2000 });

  hasChild = (_: number, node: Archivo) => node.esCarpeta;

  addCuestionario(archivo: Archivo) {
    const archivos: Cuestionario[] = this.cuestionarios.value;
    const result: Cuestionario[] = archivos.filter(_archivo => _archivo.cuestionario_id == archivo.id);
    if(result.length == 0) {
      this.cuestionarios.push(this.fb.group({ id: uuid(), nombre: archivo.nombre, clave: uuid(), cuestionario_id: archivo.id }));
    } else {
      this.errorMessage('Cuestionario ya agregado');
    }
  }

  removeCuestionario = (i: number) => this.cuestionarios.removeAt(i);

  updateEstado(asignacion: Asignacion) {
    if(asignacion.estado == 1) {
      this.aulaService.disabledCursoAsignacion(asignacion.id).subscribe((response: HttpResponse<Object>) => {
        if(response?.status == 200) {
          this.removeAsignacionRequest.emit(asignacion.id);
        } else {
          this.errorMessage('No se ha desactivado la asignación');
        }
      });
    } else {
      this.removeAsignacionRequest.emit('-1');
    }
  }

  onSubmit() {
    if(this.form.valid) {
      const asignacion: Asignacion = this.form.value;
      asignacion.fecha = moment(asignacion.fecha).format('YYYY-MM-DD');
      this.aulaService.addCursoAsignacion(this.curso, asignacion).subscribe((response: HttpResponse<Object>) => {
        if(response?.status == 200) {
          this.cuestionarioService.addCuestionariosCompartido(asignacion).subscribe((response: HttpResponse<Object>) => {
            if(response?.status == 200) {
              this.snackBar.open('Asignacion actualizada', 'Ok', { duration: 2000, panelClass: ['success'] });
            } else {
              this.errorMessage('Ha ocurrido algunos errores');
            }
          });
        } else {
          this.errorMessage('No se han guardado los cambios');
        }
      });
    } else {
      this.form.markAllAsTouched();
      this.errorMessage('Algunos campos tienen errores');
    }
  }
}
