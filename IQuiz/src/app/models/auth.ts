export interface Token {
  id: string;
  expiration: string;
}

export interface Rol {
  id?: string;
  descripcion?: string;
}

export interface User {
  id?: string;
  cedula?: string;
  nombres?: string;
  correoInstitucional?: string;
  correoPersonal?: string;
  clave?: string;
  nuevaClave?: string;
  estado?: number;
  usuarioIngreso?: string;
  fechaIngreso?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
  token?: Token;
  rol?: Rol | string;
  cursos?: string[];
}