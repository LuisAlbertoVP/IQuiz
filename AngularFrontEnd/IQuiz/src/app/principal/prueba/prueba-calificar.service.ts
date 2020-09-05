import { Injectable } from '@angular/core';
import { Repositorio, Pregunta, Literal, Tabla } from '@models/repositorio';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PruebaCalificarService {

  constructor() { }

  private cantidadOpciones(literales: Literal[]) {
    let cantidad = 0;
    for(let i = 0; i < literales.length; i++) {
      if(+literales[i].respuesta == 1) {
        cantidad++;
      }
    }
    return cantidad;
  }

  private preguntaLiterales(preg: Pregunta, pregResult: Pregunta) {
    const puntaje = preg.tipo == 0 ? preg.nota / this.cantidadOpciones(preg.literales) :
      preg.nota / preg.literales.length;
    let total = 0;
    for(let i = 0; i < preg.literales.length; i++) {
      const resp = preg.literales[i].respuesta;
      const respResult = pregResult.literales[i].respuesta;
      let ok = false;
      if(preg.tipo == 0) {
        if(+resp == 1) {
          ok = +resp == +respResult;
        }
      } else {
        ok = resp == respResult;
      }
      let nota = 0;
      if(ok) {
        total += puntaje;
        nota = puntaje;
      }
      preg.literales[i].id = uuid();
      preg.literales[i].nota = +nota.toFixed(2);
      preg.literales[i].respuesta2 = respResult;
    }
    preg.nota = +total.toFixed(2);
    return preg;
  }

  private cantidadPalabras(tabla: Tabla) {
    let cantidad = 0;
    for(let i = 0; i < tabla.filas?.length; i++) {
      const fila = tabla.filas[i];
      for(let j = 0; j < fila.columnas?.length; j++) {
        if(fila.columnas[j].palabra) {
          cantidad++;
        }
      }
    }
    return cantidad;
  }

  private preguntaTabla(preg: Pregunta, pregResult: Pregunta) {
    const puntaje = preg.nota / this.cantidadPalabras(preg.tabla);
    let total = 0;
    for(let i = 0; i < preg.literales?.length; i++) {
      preg.literales[i].id = uuid();
    }
    for(let i = 0; i < preg.tabla.filas.length; i++) {
      const fila = preg.tabla.filas[i];
      for(let j = 0; j < fila.columnas.length; j++) {
        const columna = fila.columnas[j];
        const palabra = pregResult.tabla.filas[i].columnas[j].palabra?.trim();
        if(columna.palabra == palabra) {
          total += puntaje;
        } 
        columna.nota = +puntaje.toFixed(2);
        columna.palabra2 = palabra;
      }
    }
    preg.nota = +total.toFixed(2);
    return preg;
  }

  private cantidadRespuestas(literales: Literal[]) {
    let cantidad = 0;
    for(let i = 0; i < literales.length; i++) {
      for(let j = 0; j < literales[i].entradas.length; j++) {
        if(literales[i].entradas[j].esRespuesta) {
          cantidad++;
        }
      }
    }
    return cantidad;
  }

  private preguntaCompletar(preg: Pregunta, pregResult: Pregunta): Pregunta {
    let total = 0;
    const puntaje = preg.nota / this.cantidadRespuestas(preg.literales);
    for(let i = 0; i < preg.literales.length; i++) {
      const lit = preg.literales[i];
      let subtotal = 0;
      for(let j = 0; j < lit.entradas.length; j ++) {
        let nota = 0;
        if(lit.entradas[j].entrada == pregResult.literales[i].entradas[j].entrada) {
          subtotal += puntaje;
          nota = puntaje;
        }
        if(lit.entradas[j].esRespuesta) {
          lit.entradas[j].entrada2 = pregResult.literales[i].entradas[j].entrada;
        }
        lit.entradas[j].nota = +nota.toFixed(2);
      }
      total += subtotal;
      lit.id = uuid();
      lit.nota = +subtotal.toFixed(2);
    }
    preg.nota = +total.toFixed(2);
    return preg;
  }

  calificarPrueba(cuest: Repositorio, pregsResult: Pregunta): Repositorio {
    const cuestionario = JSON.parse(JSON.stringify(cuest));
    const newIdPrueba = uuid();
    const pregs = cuestionario.preguntas;
    let total = 0;
    for(let i = 0; i < pregs.length; i++) {
      const tipo = pregs[i].tipo;
      pregs[i].id = uuid();
      if(tipo == 0 || tipo == 1 || tipo == 2 || tipo == 3) {
        pregs[i] = this.preguntaLiterales(pregs[i], pregsResult[i]);
      }
      if(tipo == 4 || tipo == 5) {
        pregs[i] = this.preguntaTabla(pregs[i], pregsResult[i]);
      }
      if(tipo == 6) {
        pregs[i] = this.preguntaCompletar(pregs[i], pregsResult[i]);
      }
      total += pregs[i].nota;
    }
    const prueba: Repositorio = {
      id: newIdPrueba,
      nota: +total.toFixed(2),
      nombre: cuestionario.nombre,
      tiempo: cuestionario.tiempo,
      preguntas: pregs
    };
    return prueba;
  }
}
