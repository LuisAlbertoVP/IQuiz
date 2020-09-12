import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '@shared_service/shared';
import { AuthService } from '@auth_service/*';
import { User } from '@models/auth';
import { Curso } from '@models/aula';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Archivo } from '@models/file';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.css']
})
export class UsuarioDetailComponent implements OnInit {
  hide: boolean = true;
  id: string;
  cursos: Curso[];
  user = this.fb.group({
    id: [''],
    cedula: ['', Validators.required],
    nombres: ['', Validators.required],
    correoInstitucional: ['', Validators.required],
    correoPersonal: [''],
    clave: [''],
    rol: this.fb.group({
      id: ['', Validators.required]
    }),
    cursos: ['', Validators.required]
  });

  constructor(
    sharedService: SharedService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: AdminService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) { 
    sharedService.changeTitle('Usuario');
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.service.getCursos().subscribe(cursos => {
        this.cursos = cursos;
        if(this.id) {
          this.service.getUser(this.id).subscribe(user => this.user.patchValue(user));
        } 
      });
    });
  }

  private isRegister(user: User): User {
    if(!user.id){
      user.id = uuid();
      user.usuarioIngreso = this.auth.getNombres();
      if(!user.clave) {
        user.clave = user.cedula;
      }
    }
    return user;
  }

  private archivos(user: User): Archivo[] {
    let archivos: Archivo[] = [];
    for(let i = 0 ; i < this.cursos.length; i++) {
      for(let j = 0; j < user.cursos.length; j++) {
        if(this.cursos[i].id == user.cursos[j]) {
          const fecha = moment().format('YYYY-MM-DD h:mm:ss');
          const archivo: Archivo = {
            id: uuid(), nombre: this.cursos[i].nombre, esCarpeta: false, fechaCreacion: fecha, fechaModificacion: fecha, 
            curso_id: user.cursos[j], parent_id: 'home'
          };
          archivos.push(archivo);
        }
      }
    }
    return archivos;
  }

  onSubmit() {
    if(this.user.valid) {
      const user: User = this.isRegister(this.user.getRawValue() as User);
      user.usuarioModificacion = this.auth.getNombres();
      if(user.clave) {
        user.clave = CryptoJS.SHA256(user.clave).toString();
      }
      forkJoin([
        this.service.addUser(user),
        this.service.addCuestionarioExplorer(user.id),
        this.service.addAulaExplorer(user.id),
        this.service.addAulaArchivos(user.id, this.archivos(user)),
        this.service.addUserCursos(user)
      ]).subscribe(responses => {
        let ok = true;
        for(let i = 0; i < responses.length; i++) {
          if((responses[i] as HttpResponse<Object>).status != 200) {
            ok = false;
          }
        }
        if(ok) {
          this.snackBar.open('Usuario actualizado','Ok', { duration: 2000, panelClass: ['success'] });
          this.router.navigate(['/principal/usuario', user.id]);
        } else {
          this.snackBar.open('Ha ocurrido algunos errores, vuelva a intentarlo','Error', { duration: 3000 });
        }
      });
    } else {
      this.user.markAllAsTouched();
      this.snackBar.open('Algunos campos tienen errores','Error', { duration: 2000 });
    }
  }

  navigate = (url: string) => this.router.navigate([url]);
}
