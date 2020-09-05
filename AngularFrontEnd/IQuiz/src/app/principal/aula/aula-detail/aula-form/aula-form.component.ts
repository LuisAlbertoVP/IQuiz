import { Component, OnInit, Input } from '@angular/core';
import { Curso, Asignacion } from '@models/aula';
import { AulaService } from '@aula_service/*';

@Component({
  selector: 'app-aula-form',
  templateUrl: './aula-form.component.html'
})
export class AulaFormComponent implements OnInit {
  @Input() curso: Curso;
  asignaciones: Asignacion[];
  
  constructor(private http: AulaService) { }

  ngOnInit(): void {
    this.requestAsignaciones();
  }

  private requestAsignaciones() {
    this.http.getCursoAsignaciones(this.curso.id).subscribe(asignaciones => {
      if(asignaciones?.length > 0) {
        this.asignaciones = asignaciones;
      } else {
        this.asignaciones = [];
      }
    });
  }

  onTabChanged($event: any) {
    if($event.index == 0) {
      this.requestAsignaciones();
    } 
  }
}
