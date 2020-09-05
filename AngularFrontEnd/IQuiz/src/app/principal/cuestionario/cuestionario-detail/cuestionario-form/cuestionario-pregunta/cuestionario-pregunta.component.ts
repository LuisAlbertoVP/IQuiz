import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { CuestionarioControlService } from '@cuestionario_controls/CuestionarioControlService';
import { Pregunta, Literal } from '@models/repositorio';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-cuestionario-pregunta',
  templateUrl: './cuestionario-pregunta.component.html'
})
export class CuestionarioPreguntaComponent implements OnInit, OnChanges {
  @Output() updateTotalNotaRequest = new EventEmitter<number>();
  @Output() refreshPreguntaRequest = new EventEmitter<Pregunta>();
  @Output() removePreguntaRequest = new EventEmitter<number>();
  @Input() form: FormGroup;
  @Input() page: number;
  display: string;

  constructor(
    private service: CuestionarioControlService
  ) {}

  ngOnInit(): void { 
    this.form.get('tipo').valueChanges.subscribe(newTipo => {
      this.refreshPregunta(newTipo);
    });
    this.form.get('nota').valueChanges.subscribe(newNota => {
      this.updateTotalNotaRequest.emit();
    });
  }

  ngOnChanges(): void {
    this.display = this.form.get('orden').value == this.page ? 'block' : 'none';
  }

  get tipo() {
    return this.form.get('tipo').value;
  }

  get literales() {
    return this.form.get('literales') as FormArray;
  }

  private refreshPregunta(newTipo: number) {
    const pregunta = this.form.value;
    pregunta['tipo'] = newTipo;
    pregunta['tabla'] = newTipo == 4 || newTipo == 5 ? { filas: [{ columnas: [{}] }] } : null;
    for(let i = 0; i < this.literales.length; i++){
      pregunta.literales[i]['entradas'] = newTipo == 6 ? [] : null;
    }
    this.refreshPreguntaRequest.emit(pregunta);
  }

  removePregunta = (orden: number) => this.removePreguntaRequest.emit(orden);

  addLiteral() {
    const newPosition: string = (this.literales.length + 1).toString();
    const newIdLiteral: string = uuid();
    const literal: Literal = { id: newIdLiteral, orden: +newPosition, abreviatura: newPosition, descripcion: '', respuesta: '' };
    const tieneRespuesta = this.tipo == 4|| this.tipo == 5 || this.tipo == 6;
    this.literales.push(this.service.toLiteralForm(literal, this.tipo == 6, tieneRespuesta));
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
    }
  }
}