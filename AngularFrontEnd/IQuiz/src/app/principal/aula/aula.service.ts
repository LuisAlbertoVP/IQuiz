import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BreadcrumbNode, Archivo } from '@models/file';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';
import { Curso, Usuario, Asignacion, Post, Cuestionario } from '@models/aula';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  apiExplorer: string = 'http://192.168.1.12:8001/explorer-aula/aulas';
  apiAsignacion: string = 'http://192.168.1.16:8003/asignacion-administracion/cursos';
  apiPost: string = 'http://192.168.1.16:8003/post-administracion/cursos';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('AulaService');
  }

  getFileParents = (id: string): Observable<BreadcrumbNode[]> => this.http.get<BreadcrumbNode[]>(`${this.apiExplorer}/${id}/parents`)
      .pipe(catchError(this.handleError('getFileParents', [])));

  getFileChildren = (id: string): Observable<Archivo[]> => this.http.get<Archivo[]>(`${this.apiExplorer}/${id}/children`)
      .pipe(catchError(this.handleError('getFileChildren', [])));

  addFile = (archivo: Archivo) => this.http.post(this.apiExplorer, archivo, httpOptions)
      .pipe(catchError(this.handleError('addFile', archivo)));

  deleteFile = (ids: string[]) => this.http.post(`${this.apiExplorer}/delete`, ids, httpOptions)
      .pipe(catchError(this.handleError('deleteFile', ids)));

  moveFiles = (ids: string[], id: string) => this.http.post<Archivo[]>(`${this.apiExplorer}/${id}/move`, ids, httpOptions)
      .pipe(catchError(this.handleError('moveFiles', ids)));

  getCurso = (id: string): Observable<Curso> => this.http.get<Curso>(`${this.apiAsignacion}/${id}`)
      .pipe(catchError(this.handleError<Curso>('getCurso')));

  getCursoUsuarios = (id: string): Observable<Usuario[]> => this.http.get<Usuario[]>(`${this.apiAsignacion}/${id}/usuarios`)
      .pipe(catchError(this.handleError('getCursoUsuarios', [])));

  addCursoAsignacion = (id: string, asignacion: Asignacion) => this.http.post(`${this.apiAsignacion}/${id}/asignaciones`, asignacion, httpOptions)
      .pipe(catchError(this.handleError('addCursoAsignacion', asignacion)));

  getCursoPruebas = (id: string): Observable<Asignacion[]> => this.http.get<Asignacion[]>(`${this.apiAsignacion}/${id}/pruebas`)
      .pipe(catchError(this.handleError('getCursoPruebas', [])));

  getCursoAsignaciones = (id: string): Observable<Asignacion[]> => this.http.get<Asignacion[]>(`${this.apiAsignacion}/${id}/asignaciones`)
      .pipe(catchError(this.handleError('getCursoAsignaciones', [])));

  getAsignacionCuestionario = (id: string, cuestionario: Cuestionario): Observable<Cuestionario> => 
      this.http.get<Cuestionario>(`${this.apiAsignacion}/asignaciones/${id}/cuestionarios/${cuestionario.id}`)
      .pipe(catchError(this.handleError<Cuestionario>('getAsignacionCuestionario')));

  addCursoPost = (id: string, post: Post) => this.http.post(`${this.apiPost}/${id}/posts`, post, httpOptions)
      .pipe(catchError(this.handleError('addCursoPost', post)));

  getCursoPosts = (id: string): Observable<Post[]> => this.http.get<Post[]>(`${this.apiPost}/${id}/posts`)
      .pipe(catchError(this.handleError('getCursoPosts', [])));

  addPostComentario = (id: string, post: Post) => this.http.post(`http://192.168.1.16:8003/post-administracion/posts/${id}/comentarios`, post, httpOptions)
      .pipe(catchError(this.handleError('addCursoPost', post)));
}
