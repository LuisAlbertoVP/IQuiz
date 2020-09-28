import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Literal } from '@models/repositorio';

@Component({
  selector: 'app-prueba-literal',
  templateUrl: './prueba-literal.component.html'
})
export class PruebaLiteralComponent implements OnInit {
  @Input() literal: Literal;
  @Input() form: FormGroup;
  @Input() tipo: number;
  @Input('data') respuestas;

  constructor() { }

  ngOnInit(): void {
  }

  get entradas() {
    return this.form.get('entradas') as FormArray;
  }
}
