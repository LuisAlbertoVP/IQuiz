import { Tiempo } from './time';

export interface Comentario {
  id: string;
  autor?: string;
  fecha?: string;
  descripcion: string;
}

export interface Post {
  id?: string;
  autor?: string;
  fecha?: string;
  descripcion: string;
  showComentarios?: boolean;
  comentarios?: Comentario[];
}

export interface Prueba {
  id?: string;
  nota: number;
  fecha?: string;
}

export interface Cuestionario {
  id?: string;
  nombre?: string;
  clave?: string;
  cuestionario_id?: string;
  prueba?: Usuario[];
}

export interface Asignacion {
  id: string;
  tema: string;
  instrucciones?: string;
  fecha: string;
  tiempo: string | Tiempo;
  cuestionarios: Cuestionario[]
}

export interface Usuario {
  id?: string;
  nombres: string;
  correoInstitucional?: string;
  rol_id?: string;
  pivot?: Prueba;
}

export interface Curso {
  id: string;
  nombre: string;
  materia: string;
  estado?: number;
}