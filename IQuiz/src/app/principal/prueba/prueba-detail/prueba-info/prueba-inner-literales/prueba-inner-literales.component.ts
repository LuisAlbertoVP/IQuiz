import { Component, OnInit, Input } from '@angular/core';
import { Literal } from '@models/repositorio';

@Component({
  selector: 'app-prueba-inner-literales',
  templateUrl: './prueba-inner-literales.component.html'
})
export class PruebaInnerLiteralesComponent implements OnInit {
  @Input('data') literales: Literal[];
  @Input() tipo: number;

  constructor() { }

  ngOnInit(): void {
  }

  transformNumber(valor: string) {
    if(this.tipo == 0) {
      if(valor == 'true' || valor == '1') {
        return 'Correcto'
      }
      return 'Incorrecto';
    }
    if(this.tipo == 1) {
      if(valor.toString() == '1') {
        return 'Verdadero'
      }
      return 'Falso';
    }
  }
}
