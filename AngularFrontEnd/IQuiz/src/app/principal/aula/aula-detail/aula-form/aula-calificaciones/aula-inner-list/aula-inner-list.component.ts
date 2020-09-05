import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from '@models/aula';

@Component({
  selector: 'app-aula-inner-list',
  templateUrl: './aula-inner-list.component.html'
})
export class AulaInnerListComponent implements OnInit {
  @Input() estudiantes: Usuario[];
  
  constructor() { }

  ngOnInit(): void {
  }

}
