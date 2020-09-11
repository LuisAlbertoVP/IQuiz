import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repositorio } from '@models/repositorio';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';
import { Prueba } from '@models/aula';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class PruebaService {
  apiPrueba: string = 'http://192.168.1.14:8002/prueba-administracion/pruebas';
  apiAsignacion: string = 'http://192.168.1.16:8003/asignacion-administracion/cursos';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('PruebaService');
  }

  addPrueba = (prueba: Repositorio) => this.http.post(this.apiPrueba, prueba, httpOptions)
      .pipe(catchError(this.handleError('addPrueba', prueba)));
  
  addPruebaCurso = (prueba: Prueba) => this.http.post(`${this.apiAsignacion}/pruebas`, prueba, httpOptions)
  .pipe(catchError(this.handleError('addPruebaCurso', prueba)));

  getPruebas = (): Observable<Repositorio[]> => this.http.get<Repositorio[]>(this.apiPrueba)
      .pipe(catchError(this.handleError<Repositorio[]>('getPruebas')));

  getPrueba = (id: string): Observable<Repositorio> => this.http.get<Repositorio>(`${this.apiPrueba}/${id}`)
      .pipe(catchError(this.handleError<Repositorio>('getPrueba')));
}
