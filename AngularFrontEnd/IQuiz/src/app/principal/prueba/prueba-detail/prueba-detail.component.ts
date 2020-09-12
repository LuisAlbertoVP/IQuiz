import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared_service/shared';
import { CuestionarioService }  from '@cuestionario_service/CuestionarioService';
import { PruebaService } from '@prueba_service/PruebaService';
import { Repositorio } from '@models/repositorio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cuestionario } from '@models/aula';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-prueba-detail',
  template: `
    <ng-container *ngIf='prueba; else elseBlock'>
      <app-prueba-info [prueba]="prueba"></app-prueba-info>
    </ng-container>
    <ng-template #elseBlock>
      <ng-container *ngIf='cuestionario'>
        <app-prueba-form [cuestionario]="cuestionario" [conAsignacion]="conAsignacion"></app-prueba-form>  
      </ng-container>
    </ng-template>
  `,
  providers: [ CuestionarioService ]
})
export class PruebaDetailComponent implements OnInit {
  cuestionario: Repositorio;
  prueba: Repositorio;
  conAsignacion: boolean;

  constructor(
    sharedService: SharedService,
    private activatedRoute: ActivatedRoute, 
    private serviceCuestionario: CuestionarioService,
    private servicePrueba: PruebaService,
    private snackBar: MatSnackBar
  ) { 
    sharedService.changeTitle('Prueba');
  }

  ngOnInit(): void {
    let idCuestionario = this.activatedRoute.snapshot.queryParamMap.get('cuestionario');
    let idAsignacion = this.activatedRoute.snapshot.queryParamMap.get('asignacion');
    if(idAsignacion) {
      let clave = this.activatedRoute.snapshot.queryParamMap.get('clave');
      const cuestionario: Cuestionario = { id: idCuestionario, clave: clave };
      this.serviceCuestionario.getCuestionarioCompartido(idAsignacion, cuestionario).subscribe((response: HttpResponse<Repositorio>) =>{
        if(response?.status == 200) {
          this.cuestionario = response.body;
          this.conAsignacion = true;
        } else {
          this.snackBar.open('No se pudo elaborar la prueba', 'Error', { duration: 2000 });
        }
      });    
    } else {
      this.activatedRoute.paramMap.subscribe(params => {
        let idPrueba = params.get('id');
        this.servicePrueba.getPrueba(idPrueba).subscribe(prueba => {
          if(prueba?.id) {
            this.prueba = prueba;
          } else {
            this.serviceCuestionario.getCuestionario(idCuestionario).subscribe(cuestionario =>{
              if(cuestionario?.id) {
                this.cuestionario = cuestionario;
                this.conAsignacion = false;
              } else {
                this.snackBar.open('No se pudo elaborar la prueba', 'Error', { duration: 2000 });
              }
            });
          }
        });
      });
    }
  }
}
