import { Component, OnInit, Input } from '@angular/core';
import { Tabla, Literal } from '@models/repositorio';

@Component({
  selector: 'app-prueba-inner-tabla',
  templateUrl: './prueba-inner-tabla.component.html'
})
export class PruebaInnerTablaComponent implements OnInit {
  @Input('data') literales: Literal[];
  @Input() tabla: Tabla;
  @Input() tipo: number;

  constructor() { }

  ngOnInit(): void {
  }
}
