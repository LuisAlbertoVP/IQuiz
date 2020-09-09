import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuestionarioService } from '@cuestionario_service/CuestionarioService';
import { CuestionarioControlService } from '@cuestionario_controls/CuestionarioControlService';
import { Repositorio, Pregunta } from '@models/repositorio';
import { v4 as uuid } from 'uuid';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-cuestionario-form',
  templateUrl: './cuestionario-form.component.html',
  styles: ['.btn-style { border: none; background: none; margin: 0px; }']
})
export class CuestionarioFormComponent implements OnInit {
  @Input() cuestionario: Repositorio;
  form: FormGroup;
  isCollapsed: boolean = false;
  pages: string;
  page: number = 1;
  display: string[];
  totalNota: number;

  constructor(
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private service: CuestionarioControlService,
    private http: CuestionarioService
  ) { }

  ngOnInit(): void {
    this.form = this.service.toCuestionarioForm(this.cuestionario);
    this.pages = this.preguntas.length + '0';
    this.updateTotalNota();
    this.form.get('puntaje').valueChanges.subscribe(newValue => {
      this.updateTotalNota();
    });
  }

  get preguntas() {
    return this.form.get('preguntas') as FormArray;
  }

  ordenarPreguntas = (longContent) => this.modalService.open(longContent, { scrollable: true });

  subirPregunta(i: number, actual: Pregunta) {
    if(i > 0) {
      const anterior: Pregunta = this.preguntas.at(i - 1).value;
      const ordenTemp = anterior.orden;
      anterior['orden'] = actual.orden;
      actual['orden'] = ordenTemp;
      this.preguntas.removeAt(i);
      this.preguntas.insert(i, this.service.toPreguntaForm(anterior));
      this.preguntas.removeAt(i - 1);
      this.preguntas.insert(i - 1, this.service.toPreguntaForm(actual));
    }
  }

  bajarPregunta(i: number, actual: Pregunta) {
    if(i < (this.preguntas.length - 1)) {
      const siguiente: Pregunta = this.preguntas.at(i + 1).value;
      const ordenTemp = siguiente.orden;
      siguiente['orden'] = actual.orden;
      actual['orden'] = ordenTemp;
      this.preguntas.removeAt(i);
      this.preguntas.insert(i, this.service.toPreguntaForm(siguiente));
      this.preguntas.removeAt(i + 1);
      this.preguntas.insert(i + 1, this.service.toPreguntaForm(actual));
    }
  }

  removePregunta(index: number) {
    this.preguntas.removeAt(index);
    for(let i = 0; i < this.preguntas.length; i++) {
      this.preguntas.at(i).get('orden').setValue(i + 1);
    }
    this.deletePagination(index + 1);
  }

  addPregunta() {
    const newPosition: number = this.preguntas.length + 1;
    const newIdPregunta: string = uuid();
    const pregunta: Pregunta = { id: newIdPregunta, orden: newPosition, puntaje: 0, tipo: 0, descripcion: '' };
    this.preguntas.push(this.service.toPreguntaForm(pregunta));
    this.addPagination();
  }

  private addPagination() {
    this.pages = (+this.pages + 10).toString();
    this.page = +this.pages / 10;
  }

  private deletePagination(orden: number) {
    this.pages = (+this.pages - 10).toString();
    this.page = orden - 1;
  }

  refreshPregunta(pregunta: Pregunta) {
    const index: number = pregunta.orden - 1;
    this.preguntas.removeAt(index);
    this.preguntas.insert(index, this.service.toPreguntaForm(pregunta));
  }

  updateTotalNota() {
    let total: number = 0;
    for(let i = 0; i < this.preguntas.length; i++) {
      const nota = this.preguntas.at(i).get('puntaje').value;
      total += nota;
    }
    this.totalNota = +this.form.get('puntaje').value - total;
  }

  onSubmit() {
    if(this.form.valid) {
      this.http.addCuestionario(this.form.getRawValue()).subscribe((response: HttpResponse<Object>) => {
        if(response.status == 200) {
          this.snackBar.open('Cuestionario actualizado', 'Ok', { duration: 2000, panelClass: ['success'] });
        } else {
          this.snackBar.open('No se han guardado los cambios', 'Error', { duration: 2000 });
        }
      });
    } else {
      this.form.markAllAsTouched();
      this.snackBar.open('Algunos campos tienen errores', 'Error', { duration: 2000 });
    }
  }
}
