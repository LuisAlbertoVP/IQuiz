import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BreadcrumbNode, Archivo } from '@models/file';
import { Repositorio, Pregunta } from '@models/repositorio';
import { Cuestionario, Asignacion } from '@models/aula';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({ providedIn: 'root' })
export class CuestionarioService {
  apiExplorer: string = 'http://192.168.1.12:8001/explorer-cuestionario/cuestionarios';
  apiCuestionario: string = 'http://192.168.1.14:8002/cuestionario-administracion/cuestionarios';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('CuestionarioService');
  }

  getFiles = (): Observable<Archivo[]> => this.http.get<Archivo[]>(this.apiExplorer)
      .pipe(catchError(this.handleError('getFiles', [])));
  
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

  getClipboard = (): Observable<Pregunta[]> => this.http.get<Pregunta[]>(`${this.apiCuestionario}/clipboard`)
      .pipe(catchError(this.handleError('getClipboard', [])));

  getCuestionarios = (ids: string[]) => this.http.post<Repositorio[]>(`${this.apiCuestionario}/download`, ids, httpOptions)
      .pipe(catchError(this.handleError('getCuestionarios', ids)));

  getCuestionario = (id: string): Observable<Repositorio> => this.http.get<Repositorio>(`${this.apiCuestionario}/${id}`)
      .pipe(catchError(this.handleError<Repositorio>('getCuestionario')));

  getCuestionarioCompartido = (id: string, cuestionario: Cuestionario) => 
      this.http.post<Repositorio>(`${this.apiCuestionario}/compartido/${id}`, cuestionario, httpOptions)
      .pipe(catchError(this.handleError('getCuestionarioCompartido', cuestionario)));
  
  addClipboard = (preguntas: Pregunta[]) => this.http.post(`${this.apiCuestionario}/clipboard`, preguntas, httpOptions)
      .pipe(catchError(this.handleError('addClipboard', preguntas)));

  addCuestionario = (cuestionario: Repositorio) => this.http.post(this.apiCuestionario, cuestionario, httpOptions)
      .pipe(catchError(this.handleError('addCuestionario', cuestionario)));

  addCuestionariosCompartido = (asignacion: Asignacion) => this.http.post(`${this.apiCuestionario}/compartido`, asignacion, httpOptions)
      .pipe(catchError(this.handleError('addCuestionariosCompartido', asignacion)));
}
