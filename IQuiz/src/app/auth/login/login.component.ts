import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '@models/auth';
import * as CryptoJS from 'crypto-js';
import { v4 as uuid } from 'uuid';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  alert: boolean = false;
  message: string = '';
  hasLogin: boolean = true;
  formLogin = this.fb.group({
    cedula: ['', Validators.required],
    clave: ['', Validators.required]
  });
  formCuenta = this.fb.group({
    cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    correoPersonal: ['',[ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    nombres: ['', Validators.required],
    clave: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$')]]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public service: AuthService
  ) { }

  ngOnInit(): void {
  }

  login() {
    if(this.formLogin.valid) {
      const user: User = this.formLogin.value;
      user.clave = CryptoJS.SHA256(user.clave).toString();
      this.service.login(user).subscribe((response: HttpResponse<User>) => {
        this.service.saveToken(response.body);
        this.router.navigate(['/principal']);
      }, error => {
        this.alert = true;
        this.message = error?.error;
      });
    }
  }

  crear() {
    if(this.formCuenta.valid) {
      const user: User = this.formCuenta.value;
      user.id = uuid();
      user.clave = CryptoJS.SHA256(user.clave).toString();
      this.service.addUser(user).subscribe((response: HttpResponse<Object>) => {
        if(response?.status == 200) {
          this.hasLogin = true;
        } else {
          this.alert = true;
        }
      });
    } else {
      this.formCuenta.markAllAsTouched();
    }
  }
}
