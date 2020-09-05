import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '@models/auth';
import { Curso } from '@models/aula';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';
import { Archivo } from '@models/file';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({ providedIn: 'root' })
export class AdminService {
  apiIdentity: string = 'http://localhost:5000/identity/usuarios';
  apiExplorer: string = 'http://localhost:5004';
  apiAsignacion: string = 'http://localhost:5006/asignacion-administracion/cursos';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('AdminService');
  }

  addUser = (user: User) => this.http.post(this.apiIdentity, user, httpOptions)
      .pipe(catchError(this.handleError('addUser', user)));

  addCurso = (curso: Curso) => this.http.post(this.apiAsignacion, curso, httpOptions)
      .pipe(catchError(this.handleError('addCurso', curso)));

  addCuestionarioExplorer = (id: string) => this.http.post(`${this.apiExplorer}/explorer-cuestionario/cuestionarios/${id}/root`, id, httpOptions)
      .pipe(catchError(this.handleError('addCuestionarioExplorer', id)));

  addAulaExplorer = (id: string) => this.http.post(`${this.apiExplorer}/explorer-aula/aulas/${id}/root`, id, httpOptions)
      .pipe(catchError(this.handleError('addAulaExplorer', id)));

  addAulaArchivos = (id: string, archivos: Archivo[]) => this.http.post(`${this.apiExplorer}/explorer-aula/aulas/${id}/root/children`, archivos, httpOptions)
      .pipe(catchError(this.handleError('addAulaArchivos', archivos)));

  addUserCursos = (user: User) => this.http.post(`${this.apiAsignacion}/usuarios`, user, httpOptions)
      .pipe(catchError(this.handleError('addUserCursos', user)));

  disabledUser = (id: string) => this.http.post(`${this.apiIdentity}/${id}/disabled`, id, httpOptions)
      .pipe(catchError(this.handleError('disabledUser', id)));

  enabledUser = (id: string) => this.http.post(`${this.apiIdentity}/${id}/enabled`, id, httpOptions)
      .pipe(catchError(this.handleError('enabledUser', id)));

  disabledCurso = (id: string) => this.http.post(`${this.apiAsignacion}/${id}/disabled`, id, httpOptions)
      .pipe(catchError(this.handleError('disabledCurso', id)));

  enabledCurso = (id: string) => this.http.post(`${this.apiAsignacion}/${id}/enabled`, id, httpOptions)
      .pipe(catchError(this.handleError('enabledCurso', id)));

  getUsers = (): Observable<User[]> => this.http.get<User[]>(this.apiIdentity)
      .pipe(catchError(this.handleError('getUsers', [])));

  getCursos = (): Observable<Curso[]> => this.http.get<Curso[]>(this.apiAsignacion)
      .pipe(catchError(this.handleError('getCursos', [])));

  getUser = (id: string): Observable<User> => this.http.get<User>(`${this.apiIdentity}/${id}`)
      .pipe(catchError(this.handleError<User>('getUser')));
}
