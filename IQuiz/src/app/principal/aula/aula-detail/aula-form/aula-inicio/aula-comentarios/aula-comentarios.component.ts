import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AulaService } from '@aula_service/*';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { Comentario } from '@models/aula';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

@Component({
  selector: 'app-aula-comentarios',
  templateUrl: './aula-comentarios.component.html'
})
export class AulaComentariosComponent implements OnInit {
  @Input() id: string;
  @Input() comentarios: Comentario[];
  comentario = this.fb.group({
    id: [''],
    descripcion: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private service: AulaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.comentario.valid) {
      const comentario: Comentario = this.comentario.value;
      comentario.id = uuid();
      comentario.fecha = moment().format('YYYY-MM-DD h:mm:ss');
      this.service.addPostComentario(this.id, comentario).subscribe((response: HttpResponse<Object>) => {
        if(response?.status == 200) {
          comentario.autor = localStorage.getItem('nombres');
          this.comentarios.push(comentario);
        } else {
          this.snackBar.open('No se ha publicado el comentario', 'Error', { duration: 2000 });
        }
      });
    }
  }
}
