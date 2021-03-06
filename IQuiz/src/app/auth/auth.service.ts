import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService, HandleError } from '../http-error-handler.service';
import { User, Rol } from '@models/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiIdentity: string = 'http://localhost:8000/identity';
  private handleError: HandleError;

  constructor(
    private http: HttpClient, 
    httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('AuthService');
  }

  addUser = (user: User) => this.http.post(`${this.apiIdentity}/crear`, user, httpOptions)
      .pipe(catchError(this.handleError('addUser', user)));

  changePassword = (user: User) => this.http.post(`${this.apiIdentity}/update`, user, httpOptions)
      .pipe(catchError(this.handleError('changePassword', user)));

  login = (user: User) => this.http.post(`${this.apiIdentity}/login`, user, httpOptions);

  saveToken(user: User) {
    localStorage.setItem('id', user.id);
    localStorage.setItem('nombres', user.nombres);
    localStorage.setItem('id_token', user.token.id);
    localStorage.setItem('token_expiration', user.token.expiration);
    localStorage.setItem('rol', (user.rol as Rol).descripcion);
  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('nombres');
    localStorage.removeItem('id_token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('rol');
  }

  getAuthorizationToken() {
    return localStorage.getItem('id_token');
  }

  getTokenExpiration() {
    return localStorage.getItem('token_expiration');
  }

  getId() {
    return localStorage.getItem('id');
  }

  getNombres() {
    return localStorage.getItem('nombres');
  }

  getRol() {
    return localStorage.getItem('rol');
  }
}
