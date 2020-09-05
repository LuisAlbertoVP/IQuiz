import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { AulaService }  from '@aula_service/AulaService';
import { Curso } from '@models/aula';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-aula-detail',
  template: `
    <app-bar-directory></app-bar-directory>
    <ng-container *ngIf='curso'>
      <app-aula-form [curso]="curso"></app-aula-form>
    </ng-container>
  `,
  providers: [ AulaService ]
})
export class AulaDetailComponent implements OnInit {
  curso: Curso;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private service: AulaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.service.getCurso(params.get('curso')).subscribe(curso => {
        if(curso?.id) {
          this.curso = curso;
        } else {
          this.snackBar.open('No existe Aula', 'Error', { duration: 2000 });
        }
      });
    });
  }

}
