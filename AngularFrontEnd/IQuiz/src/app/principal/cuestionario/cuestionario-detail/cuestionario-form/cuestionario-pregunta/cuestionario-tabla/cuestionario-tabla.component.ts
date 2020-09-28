import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { CuestionarioControlService } from '@cuestionario_controls/CuestionarioControlService';

@Component({
  selector: 'app-cuestionario-tabla',
  templateUrl: './cuestionario-tabla.component.html'
})
export class CuestionarioTablaComponent implements OnInit {
  @Input() form: FormGroup;
  nColumnas: number;

  constructor(
    private service: CuestionarioControlService
  ) { }

  ngOnInit(): void {
    this.nColumnas = this.filas.length > 0 ? this.columnas(0).length : 0;
  }

  get filas() {
    return this.form.get('filas') as FormArray;
  }

  columnas = (index: number) => this.filas.at(index).get('columnas') as FormArray;

  updateFilas = (newFila: number) => this.updateTabla(newFila);

  updateColumnas(newColumna: number) {
    this.nColumnas = newColumna;
    this.updateTabla(this.filas.length);
  }

  private updateTabla(newFila: number) {
    this.filas.clear();
    const filas = new Array(+newFila).fill({ columnas : new Array(+this.nColumnas).fill({}) });
    for(let i = 0; i < filas.length; i++) {
      this.filas.push(this.service.toFilaForm(filas[i]));
    }
  }
}
