import { Tiempo } from './time';

export interface Entrada {
  nota?: number;
  entrada: string;
  entrada2?: string;
  esRespuesta: boolean;
}

export interface Literal {
  id: string;
  nota?: number;
  orden: number;
  abreviatura?: string;
  descripcion?: string;
  respuesta?: string;
  respuesta2?: string;
  entradas? : Entrada[];
}

export interface Columna {
  nota?: number;
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
  nota?: number;
  orden: number;
  tipo: number;
  descripcion: string;
  tabla?: Tabla;
  retroalimentacion?: string;
  literales?: Literal[];
}

export interface Repositorio {
  id: string;
  nota: number;
  nombre: string;
  descripcion?: string;
  tiempo: Tiempo;
  duracion?: string;
  preguntas: Pregunta[];
}