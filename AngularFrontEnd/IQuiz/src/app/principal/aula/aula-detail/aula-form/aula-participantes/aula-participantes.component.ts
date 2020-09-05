import { Component, OnInit, Input } from '@angular/core';
import { AulaService } from '@aula_service/*';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario, Curso } from '@models/aula';

@Component({
  selector: 'app-aula-participantes',
  templateUrl: './aula-participantes.component.html'
})
export class AulaParticipantesComponent implements OnInit {
  @Input() curso: Curso;
  profesores: Usuario[] = [];
  estudiantes: Usuario[] = [];
  
  constructor(
    private service: AulaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.service.getCursoUsuarios(this.curso.id).subscribe(usuarios => {
      if(usuarios?.length > 0) {
        for(let i = 0; i < usuarios.length; i++) {
          if(usuarios[i].rol_id == '3') {
            this.estudiantes.push(usuarios[i]);
          } else {
            this.profesores.push(usuarios[i]);
          }
        }
      } else {
        this.snackBar.open('No existen participantes', 'Error', { duration: 2000 });
      }
    });
  }

}
