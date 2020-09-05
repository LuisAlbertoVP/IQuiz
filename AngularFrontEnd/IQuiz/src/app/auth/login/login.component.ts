import { Component, OnInit } from '@angular/core';
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
  formLogin = this.fb.group({
    cedula: ['', Validators.required ],
    clave: ['', Validators.required ]
  });

  constructor(
    private fb: FormBuilder,
    public service: AuthService
  ) { }

  ngOnInit(): void {
  }

  login() {
    if(this.formLogin.valid) {
      const user: User = this.formLogin.value;
      user.clave = CryptoJS.SHA256(user.clave).toString();
      this.service.login(user);
    }
  }
}
