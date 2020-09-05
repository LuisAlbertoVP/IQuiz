import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { CuestionarioService }  from '@cuestionario_service/CuestionarioService';
import { Repositorio } from '@models/repositorio';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cuestionario-detail',
  template: `
    <app-bar-directory></app-bar-directory>
    <ng-container *ngIf='cuestionario'>
      <app-cuestionario-form [cuestionario]="cuestionario"></app-cuestionario-form>  
    </ng-container>
  `,
  providers: [ CuestionarioService ]
})
export class CuestionarioDetailComponent implements OnInit {
  cuestionario: Repositorio;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private service: CuestionarioService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.service.getCuestionario(params.get('id')).subscribe(cuestionario => {
        if(cuestionario?.id) {
          this.cuestionario = cuestionario;
        } else {
          this.snackBar.open('No existe cuestionario', 'Error', { duration: 2000 });
        }
      });
    });
  }
}
