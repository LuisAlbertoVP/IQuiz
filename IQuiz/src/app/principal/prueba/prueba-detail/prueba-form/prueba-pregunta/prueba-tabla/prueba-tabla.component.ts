import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Tabla } from '@models/repositorio';

@Component({
  selector: 'app-prueba-tabla',
  templateUrl: './prueba-tabla.component.html',
  styles: [ 'button { border: none; margin: 3px; }' ]
})
export class PruebaTablaComponent implements OnInit {
  @Input() tabla: Tabla;
  @Input() form: FormGroup;
  @Input() tipo: number;
  letras = [];

  constructor() { }

  ngOnInit(): void {
    this.esSopaDeLetras();
  }

  get filas() {
    return this.form.get('filas') as FormArray;
  }

  esSopaDeLetras() {
    if(this.tipo == 5) {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      for(let i = 0; i < this.tabla.filas.length; i++) {
        let columnas = [];
        for(let j = 0; j < this.tabla.filas[i].columnas.length; j++) {
          if(!this.tabla.filas[i].columnas[j].palabra) {
            const letra = alphabet[Math.floor(Math.random() * alphabet.length)];
            columnas.push(letra);
          } else {
            columnas.push(this.tabla.filas[i].columnas[j].palabra);
          }
        }
        this.letras.push(columnas);
      }
    }
  }
}
