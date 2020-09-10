import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AulaService } from '@aula_service/*';
import { Asignacion, Curso, Post, Cuestionario } from '@models/aula';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

@Component({
  selector: 'app-aula-inicio',
  templateUrl: './aula-inicio.component.html',
  styleUrls: ['./aula-inicio.component.css']
})
export class AulaInicioComponent implements OnInit {
  @Input() curso: Curso;
  @Input() asignaciones: Asignacion[];
  posts: Post[];
  post = this.fb.group({
    id: [''],
    descripcion: ['', Validators.required],
    comentarios: this.fb.array([])
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: AulaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.service.getCursoPosts(this.curso.id).subscribe(posts => {
      if(posts?.length > 0) {
        this.posts = posts;
      } else {
        this.posts = [];
      }
    })
  }

  visibleComentario = (post: Post) => post.showComentarios = post.showComentarios ? false : true;

  parseTime = (time) => moment(time.hour + ':' + time.minute, 'HH:mm').format('HH:mm A');

  requestClave(id: string, cuestionario: Cuestionario) {
    this.service.getAsignacionCuestionario(id, cuestionario).subscribe(newCuestionario => {
      if(newCuestionario?.clave) {
        const cb: NavigationExtras = { queryParams: { asignacion: id, cuestionario: cuestionario.cuestionario_id, clave: newCuestionario.clave } };
        this.router.navigate(['/principal/prueba', cuestionario.id], cb);
      } else {
        this.snackBar.open('Prueba no disponible', 'Error', { duration: 2000 });
      }
    });
  }

  onSubmit() {
    if(this.post.valid) {
      const post: Post = this.post.value;
      post.id = uuid();
      post.fecha = moment().format('YYYY-MM-DD h:mm:ss');
      this.service.addCursoPost(this.curso.id, post).subscribe((response: HttpResponse<Object>) => {
        if(response?.status == 200) {
          this.posts.push(post);
        } else {
          this.snackBar.open('No se ha publicado el post', 'Error', { duration: 2000 });
        }
      });
    }
  }
}
