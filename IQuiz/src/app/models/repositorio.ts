import { Tiempo } from './time';

export interface Entrada {
  entrada: string;
  entrada2?: string;
  esRespuesta: boolean;
}

export interface Literal {
  id: string;
  puntaje?: number;
  nota?: number;
  orden: number;
  abreviatura?: string;
  descripcion?: string;
  respuesta?: string;
  respuesta2?: string;
  pregunta_id?: string;
  entradas? : Entrada[];
}

export interface Columna {
  palabra?: string;
  palabra2?: string;
}

export interface Fila {
  columnas: Columna[];
}

export interface Tabla {
  filas: Fila[];
}

export interface Pregunta {
  id: string;
  puntaje: number;
  nota?: number;
  orden: number;
  tipo: number;
  descripcion: string;
  tabla?: Tabla;
  retroalimentacion?: string;
  cuestionario_id?: string;
  literales?: Literal[];
}

export interface Repositorio {
  id: string;
  puntaje: number;
  nota?: number;
  nombre: string;
  descripcion?: string;
  tiempo: Tiempo;
  duracion?: string;
  fecha?: string;
  materia?: string;
  preguntas: Pregunta[];
}