import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CuestionarioService }  from '@cuestionario_service/CuestionarioService';
import { Archivo } from '@models/file';

@Component({
  selector: 'app-cuestionario-explorer',
  template: `
    <app-bar-directory [data]="extras"></app-bar-directory>
    <ng-container *ngIf='archivos$ | async as archivos'>
      <app-cuestionario-list [data]="archivos" (updateExtrasRequest)="updateExtras($event)"></app-cuestionario-list>
    </ng-container>
  `,
  providers: [ CuestionarioService ]
})
export class CuestionarioExplorerComponent implements OnInit {
  archivos$: Observable<Archivo[]>;
  idParent: string;
  extras: any;

  constructor(
    private activedRoute: ActivatedRoute,
    private service: CuestionarioService
  ) { }

  ngOnInit(): void {
    this.archivos$ = this.activedRoute.paramMap.pipe(
      switchMap(params => {
        this.idParent = params.get('id');
        return this.service.getFileChildren(this.idParent);
      })
    );
  }

  updateExtras = (extras) => this.extras = extras;
}
