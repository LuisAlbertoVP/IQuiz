import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormGroup } from '@angular/forms';
import { PruebaService } from '@prueba_service/PruebaService';
import { PruebaControlService } from '@prueba_controls/PruebaControlService';
import { PruebaCalificarService } from '@prueba_calificar/PruebaCalificarService';
import { Repositorio } from '@models/repositorio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { Prueba } from '@models/aula';

@Component({
  selector: 'app-prueba-form',
  templateUrl: './prueba-form.component.html',
  providers: [ PruebaService ]
})
export class PruebaFormComponent implements OnInit, OnDestroy {
  @Input() cuestionario: Repositorio;
  @Input() conAsignacion: boolean;
  form: FormGroup;
  pages: string;
  idPrueba: string;
  page: number = 1;
  interval: any;
  segundos: number = 0; 

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: PruebaControlService,
    private calificar: PruebaCalificarService,
    private http: PruebaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.idPrueba = params.get('id');
      this.pages = this.cuestionario.preguntas.length + '0';
      this.form = this.service.toPruebaForm(this.cuestionario);
      this.setTime();
    });
  }

  ngOnDestroy(): void {
    if(this.interval) {
      clearInterval(this.interval);
    }
  }

  get preguntas() {
    return this.form.get('preguntas') as FormArray;
  }

  setTime() {
     this.interval = setInterval(() => {
      if(this.segundos == 0) {
        if(this.cuestionario.tiempo.minute > 0) {
          this.segundos = 60;
          this.cuestionario.tiempo.minute--;
        } else {
          if(this.cuestionario.tiempo.hour > 0) {
            this.segundos = 60;
            this.cuestionario.tiempo.minute = 59;
            this.cuestionario.tiempo.hour--;
          } else {
            this.onSubmit();
          }
        }
      }
      this.segundos--;
    }, 1000);
  }

  onSubmit() {
    //if(this.form.valid) {
      const pregsResult = this.form.getRawValue()['preguntas'];
      const prueba: Repositorio = this.calificar.calificarPrueba(this.cuestionario, pregsResult);
      this.http.addPrueba(prueba).subscribe((response: HttpResponse<Object>) => {
        if(response.status == 200) {
          this.snackBar.open('Prueba realizada', 'Ok', { duration: 2000, panelClass: ['success'] });
          if(this.conAsignacion) {
            const newPrueba: Prueba = { id: this.idPrueba, nota: prueba.nota };
            this.http.addPruebaCurso(newPrueba).subscribe((response: HttpResponse<Object>) => {
              if(response.status == 200) {
                this.snackBar.open('Calificacion actualizada', 'Ok', { duration: 2000, panelClass: ['success'] });
              } else {
                this.snackBar.open('Ha ocurrido errores, vuelva a intentarlo', 'Error', { duration: 3000 });
              }
            });
          }
          //this.router.navigate(['/cuestionario', 4]);
        } else {
          this.snackBar.open('No se han guardado los cambios, vuelva a intentarlo', 'Error', { duration: 3000 });
        }
      });
    //} else {
      //this.form.markAllAsTouched();
      //this.snackBar.open('Faltan llenar campos', 'Error', { duration: 2000 });
   // }
  }
}
