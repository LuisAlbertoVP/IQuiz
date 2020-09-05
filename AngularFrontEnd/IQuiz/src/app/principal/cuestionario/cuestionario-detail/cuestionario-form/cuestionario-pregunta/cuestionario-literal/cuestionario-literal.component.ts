import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { CuestionarioControlService } from '@cuestionario_controls/CuestionarioControlService';
import { Entrada } from '@models/repositorio';

@Component({
  selector: 'app-cuestionario-literal',
  templateUrl: './cuestionario-literal.component.html'
})
export class CuestionarioLiteralComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() tipo: number;

  constructor(
    private service: CuestionarioControlService
  ) { }

  ngOnInit(): void {
  }

  get entradas() {
    return this.form.get('entradas') as FormArray;
  }

  addEntrada(esRespuesta: boolean) {
    const entrada: Entrada = { entrada: '', esRespuesta: esRespuesta };
    this.entradas.push(this.service.toEntradaForm(entrada));
  }
}
