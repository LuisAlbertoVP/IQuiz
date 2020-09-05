import { Component, OnInit, Input } from '@angular/core';
import { Repositorio, Pregunta } from '@models/repositorio';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-prueba-info',
  templateUrl: './prueba-info.component.html',
  styleUrls: ['./prueba-info.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PruebaInfoComponent implements OnInit {
  @Input() prueba: Repositorio;
  columnsToDisplay = ['orden', 'descripcion', 'nota'];
  expandedElement: Pregunta;

  constructor() { }

  ngOnInit(): void {
  }

  get preguntas() {
    return this.prueba.preguntas;
  }
}
