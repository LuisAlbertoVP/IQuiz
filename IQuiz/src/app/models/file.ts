export interface BreadcrumbNode {
  id: string;
  nombre: string;
}

export interface Archivo {
  id: string;
  nombre: string;
  esCarpeta: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  parent_id: string;
  curso_id?: string;
  archivos?: Archivo[];
}