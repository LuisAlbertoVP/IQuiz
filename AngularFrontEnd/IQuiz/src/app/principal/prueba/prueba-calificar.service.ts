import { Injectable } from '@angular/core';
import { Repositorio, Pregunta, Literal, Tabla } from '@models/repositorio';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PruebaCalificarService {

  constructor() { }

  private cantidadOpciones(literales: Literal[]): number {
    let cantidad = 0;
    for(let i = 0; i < literales.length; i++) {
      if(+literales[i].respuesta == 1) {
        cantidad++;
      }
    }
    return cantidad;
  }

  private preguntaLiterales(pregunta: Pregunta, resultado: Pregunta): Pregunta {
    if(pregunta.literales?.length > 0) {
      let notaPregunta = 0;
      const puntajeLiteral = pregunta.tipo == 0 ? pregunta.puntaje / this.cantidadOpciones(pregunta.literales) :
        pregunta.puntaje / pregunta.literales.length;
      for(let i = 0; i < pregunta.literales.length; i++) {
        const respuesta = pregunta.literales[i].respuesta;
        const respuestaResultado = resultado.literales[i].respuesta;
        let ok = false;
        if(pregunta.tipo == 0) {
          if(+respuesta == 1) {
            ok = +respuesta == +respuestaResultado;
          }
        } else {
          ok = respuesta == respuestaResultado;
        }
        let nota = 0;
        if(ok) {
          notaPregunta += Number.isFinite(puntajeLiteral) ? puntajeLiteral : 0;
          nota = Number.isFinite(puntajeLiteral) ? puntajeLiteral : 0;
        }
        pregunta.literales[i].id = uuid();
        pregunta.literales[i].puntaje = Number.isFinite(puntajeLiteral) ? puntajeLiteral : 0;
        pregunta.literales[i].nota = +nota.toFixed(2);
        pregunta.literales[i].respuesta2 = respuestaResultado;
      }
      pregunta.nota = +notaPregunta.toFixed(2);
    } else {
      pregunta.nota = 0;
    }
    return pregunta;
  }

  private cantidadPalabras(tabla: Tabla): number {
    let cantidad = 0;
    for(let i = 0; i < tabla.filas?.length; i++) {
      const fila = tabla.filas[i];
      for(let j = 0; j < fila.columnas?.length; j++) {
        if(fila.columnas[j].palabra?.length > 0) {
          cantidad++;
        }
      }
    }
    return cantidad;
  }

  private preguntaTabla(pregunta: Pregunta, resultado: Pregunta): Pregunta {
    let notaPregunta = 0;
    const puntajePalabra = pregunta.puntaje / this.cantidadPalabras(pregunta.tabla);
    for(let i = 0; i < pregunta.literales?.length; i++) {
      pregunta.literales[i].id = uuid();
    }
    for(let i = 0; i < pregunta.tabla.filas.length; i++) {
      const fila = pregunta.tabla.filas[i];
      for(let j = 0; j < fila.columnas.length; j++) {
        const columna = fila.columnas[j];
        const palabra = resultado.tabla.filas[i].columnas[j].palabra?.trim();
        if(columna.palabra == palabra) {
          notaPregunta += puntajePalabra;
        }
        columna.palabra2 = palabra;
      }
    }
    pregunta.nota = +notaPregunta.toFixed(2);
    return pregunta;
  }

  private cantidadRespuestas(literal: Literal): number {
    let cantidad = 0;
    for(let i = 0; i < literal.entradas.length; i++) {
      if(literal.entradas[i].esRespuesta) {
        cantidad++;
      }
    }
    return cantidad;
  }

  private preguntaCompletar(pregunta: Pregunta, resultado: Pregunta): Pregunta {
    if(pregunta.literales?.length > 0) {
      let notaPregunta = 0;
      const puntajeLiteral = pregunta.puntaje / pregunta.literales.length;
      for(let i = 0; i < pregunta.literales.length; i++) {
        const literal = pregunta.literales[i];
        const puntajeEntrada= puntajeLiteral / this.cantidadRespuestas(literal);
        let notaLiteral = 0;
        for(let j = 0; j < literal.entradas.length; j ++) {
          if(literal.entradas[j].entrada == resultado.literales[i].entradas[j].entrada) {
            notaLiteral += puntajeEntrada;
          }
          if(literal.entradas[j].esRespuesta) {
            literal.entradas[j].entrada2 = resultado.literales[i].entradas[j].entrada;
          }
        }
        literal.id = uuid();
        literal.puntaje = +puntajeLiteral.toFixed(2);
        literal.nota = +notaLiteral.toFixed(2);
        notaPregunta += notaLiteral;
      }
      pregunta.nota = +notaPregunta.toFixed(2);
    } else {
      pregunta.nota = 0;
    }
    return pregunta;
  }

  calificarPrueba(cuestionario: Repositorio, resultado: Pregunta): Repositorio {
    cuestionario = JSON.parse(JSON.stringify(cuestionario));
    const newIdPrueba = uuid();
    const preguntas = cuestionario.preguntas;
    let total = 0;
    for(let i = 0; i < preguntas.length; i++) {
      const tipo = preguntas[i].tipo;
      preguntas[i].id = uuid();
      if(tipo == 0 || tipo == 1 || tipo == 2 || tipo == 3) {
        preguntas[i] = this.preguntaLiterales(preguntas[i], resultado[i]);
      }
      if(tipo == 4 || tipo == 5) {
        preguntas[i] = this.preguntaTabla(preguntas[i], resultado[i]);
      }
      if(tipo == 6) {
        preguntas[i] = this.preguntaCompletar(preguntas[i], resultado[i]);
      }
      total += preguntas[i].nota;
    }
    const prueba: Repositorio = {
      id: newIdPrueba,
      puntaje: cuestionario.puntaje,
      nota: +total.toFixed(2),
      nombre: cuestionario.nombre,
      tiempo: cuestionario.tiempo,
      preguntas: preguntas
    };
    return prueba;
  }
}
