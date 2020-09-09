import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '@models/auth';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  alert: boolean = false;
  formLogin = this.fb.group({
    cedula: ['', Validators.required ],
    clave: ['', Validators.required ]
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
      this.service.login(user).subscribe(user => {
        if(user?.token) {
          this.service.saveToken(user);
          this.router.navigate(['/principal/cuestionarios/home']);
        } else {
          this.alert = true;
        }
      });;
    }
  }
}
