import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Repositorio, Pregunta, Tabla, Fila, Columna, Literal, Entrada } from '@models/repositorio';

@Injectable({
  providedIn: 'root'
})
export class PruebaControlService {

  constructor(private fb: FormBuilder) { }

  private preguntas(preguntas: Pregunta[]){
    const array = [];
    for(let i = 0; i < preguntas?.length; i++) {
      array.push(this.toPreguntaForm(preguntas[i]));
    }
    return array;
  }

  private literales(literales: Literal[], tipo: number){
    const array = [];
    for(let i = 0; i < literales?.length; i++) {
      array.push(this.toLiteralForm(literales[i]));
    }
    return array;
  }

  private entradas(entradas: Entrada[]){
    const array = [];
    for(let i = 0; i < entradas?.length; i++) {
      array.push(this.toEntradaForm(entradas[i]));
    }
    return array;
  }

  private filas(filas: Fila[]){
    const array = [];
    for(let i = 0; i < filas?.length; i++) {
      array.push(this.toFilaForm(filas[i]));
    }
    
    return array;
  }

  private columnas(columnas: Columna[]){
    const array = [];
    for(let i = 0; i < columnas?.length; i++) {
      array.push(this.toColumnaForm(columnas[i]));
    }
    return array;
  }

  toPruebaForm = (c: Repositorio) => this.fb.group({ preguntas: this.fb.array(this.preguntas(c.preguntas)) });

  toPreguntaForm = (p: Pregunta) => this.fb.group({ tabla: this.toTablaForm(p.tabla), 
      literales: this.fb.array(this.literales(p?.literales, p.tipo)) });

  toTablaForm= (t: Tabla) => t?.filas ? 
      this.fb.group({ filas: this.fb.array(this.filas(t?.filas)) }) : this.fb.group({});

  toFilaForm = (f: Fila) => this.fb.group({ columnas: this.fb.array(this.columnas(f?.columnas)) });

  toColumnaForm = (c: Columna) => this.fb.group({ palabra: [''] });

  toLiteralForm = (l: Literal) => this.fb.group({ respuesta: [''],
      entradas: this.fb.array(this.entradas(l?.entradas)) });

  toEntradaForm = (e: Entrada) => this.fb.group({ entrada: [''] });
}