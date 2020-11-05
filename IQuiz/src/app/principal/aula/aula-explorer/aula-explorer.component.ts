import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared_service/shared';
import { AulaService }  from '@aula_service/AulaService';
import { Archivo } from '@models/file';

@Component({
  selector: 'app-aula-explorer',
  template: `
    <app-bar-directory [data]="extras"></app-bar-directory>
    <ng-container *ngIf='archivos$ | async as archivos'>
      <app-aula-list [data]="archivos" (updateExtrasRequest)="updateExtras($event)"></app-aula-list>
    </ng-container>
  `,
  providers: [ AulaService ]
})
export class AulaExplorerComponent implements OnInit {
  archivos$: Observable<Archivo[]>;
  idParent: string;
  extras: any;

  constructor(
    sharedService: SharedService,
    private activedRoute: ActivatedRoute,
    private service: AulaService
  ) { 
    sharedService.changeTitle('Explorador de cursos');
  }

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
