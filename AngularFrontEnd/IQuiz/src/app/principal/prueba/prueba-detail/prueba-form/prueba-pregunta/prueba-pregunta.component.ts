import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Pregunta } from '@models/repositorio';

@Component({
  selector: 'app-prueba-pregunta',
  templateUrl: './prueba-pregunta.component.html'
})
export class PruebaPreguntaComponent implements OnInit, OnChanges {
  @Input() pregunta: Pregunta;
  @Input() form: FormGroup;
  @Input() page: number;
  display: string;
  respuestas: string[];

  constructor() { }

  ngOnInit(): void {
    this.esEmparejamiento();
  }

  ngOnChanges(): void {
    this.display = this.pregunta.orden == this.page ? 'block' : 'none';
  }

  get literales() {
    return this.form.get('literales') as FormArray;
  }

  esEmparejamiento() {
    if(this.pregunta.tipo == 3) {
      this.respuestas = [];
      for(let i = 0; i < this.pregunta.literales.length; i++) {
        this.respuestas[i] = this.pregunta.literales[i].respuesta;
      }
      for (let i = this.respuestas.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = this.respuestas[i];
        this.respuestas[i] = this.respuestas[j];
        this.respuestas[j] = temp;
      }
    }
  }
}
