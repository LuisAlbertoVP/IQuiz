import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Repositorio, Pregunta, Tabla, Fila, Columna, Literal, Entrada } from '@models/repositorio';
import { Tiempo } from '@models/time';

@Injectable({ providedIn: 'root' })
export class CuestionarioControlService {

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
      array.push(this.toLiteralForm(literales[i], tipo == 6, tipo == 4|| tipo == 5 || tipo == 6));
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

  toCuestionarioForm(c: Repositorio) {
    return this.fb.group({
      id : [c.id],
      puntaje: [c.puntaje, [Validators.required, Validators.min(1)]],
      nombre: [c.nombre],
      descripcion: [c.descripcion ? c.descripcion : ''],
      tiempo: this.toTiempoForm(c.tiempo),
      preguntas: this.fb.array(this.preguntas(c.preguntas))
    });
  }

  toTiempoForm(t: Tiempo) { 
    return t ? this.fb.group({ 
      hour: [t.hour, Validators.required], 
      minute: [t.minute, [Validators.required, Validators.min(5)]] }) 
    : this.fb.group({});
  }

  toPreguntaForm(p: Pregunta) {
    return this.fb.group({
      id: [p.id],
      puntaje: [p.puntaje, [Validators.required]],
      orden: [p.orden],
      tipo: [p.tipo],
      descripcion: [p.descripcion, Validators.required],
      tabla: this.toTablaForm(p.tabla),
      retroalimentacion: [p.retroalimentacion ? p.retroalimentacion : ''],
      literales: this.fb.array(this.literales(p?.literales, p.tipo))
    });
  }

  toTablaForm = (t: Tabla) => t?.filas ? 
      this.fb.group({ filas: this.fb.array(this.filas(t?.filas)) }) : this.fb.group({});

  toFilaForm = (f: Fila) => this.fb.group({ columnas: this.fb.array(this.columnas(f?.columnas)) });

  toColumnaForm = (c: Columna) => this.fb.group({ palabra: [c.palabra] });

  toLiteralForm(l: Literal, tieneDescripcion = false, tieneRespuesta = false) {
    return this.fb.group({
      id: [l.id],
      orden: [l.orden],
      abreviatura: [l.abreviatura, Validators.required],
      descripcion: !tieneDescripcion ? [l.descripcion, Validators.required] : [l.descripcion],
      respuesta: !tieneDescripcion && !tieneRespuesta ? [l.respuesta, Validators.required] : [''],
      entradas: this.fb.array(this.entradas(l?.entradas))
    });
  }

  toEntradaForm = (e: Entrada) => this.fb.group({ entrada: [e.entrada, Validators.required],
      esRespuesta: [e.esRespuesta] });
}