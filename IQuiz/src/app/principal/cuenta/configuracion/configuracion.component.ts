import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '@shared_service/*';
import { AuthService } from '@auth_service/*';
import { User } from '@models/auth';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html'
})
export class ConfiguracionComponent implements OnInit {
  hideAnterior: boolean = true;
  hideNueva: boolean = true;
  cuenta = this.fb.group({
    clave: ['', Validators.required],
    nuevaClave: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$')]]
  });
  constructor(
    sharedService: SharedService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private service: AuthService
  ) { 
    sharedService.changeTitle('Cambiar contraseña');
  }

  ngOnInit(): void {
  }

  private errorMessage = (message: string) => this.snackBar.open(message, 'Error', { duration: 2000 });

  changePassword() {
    if(this.cuenta.valid) {
      let user: User = this.cuenta.getRawValue();
      user.id = this.service.getId();
      user.clave = CryptoJS.SHA256(user.clave).toString();
      user.nuevaClave = CryptoJS.SHA256(user.nuevaClave).toString();
      this.service.changePassword(user).subscribe((response: HttpResponse<Object>) => {
        if(response?.status == 200) {
          this.snackBar.open('Contraseña actualizada','Ok', { duration: 2000, panelClass: ['success'] });
        } else {
          this.errorMessage('La contraseña es incorrecta');
        }
      });
    } else {
      this.cuenta.markAllAsTouched();
      this.errorMessage('Algunos campos tienen errores');
    }
  }
}
