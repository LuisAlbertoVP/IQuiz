import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BarDirectoryComponent } from './bar-directory/bar-directory.component';
import { AulaRoutingModule } from './aula-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { AulaDetailComponent } from './aula-detail/aula-detail.component';
import { AulaExplorerComponent } from './aula-explorer/aula-explorer.component';
import { AulaListComponent } from './aula-explorer/aula-list/aula-list.component';
import { AulaFormComponent } from './aula-detail/aula-form/aula-form.component';
import { AulaInicioComponent } from './aula-detail/aula-form/aula-inicio/aula-inicio.component';
import { AulaComentariosComponent } from './aula-detail/aula-form/aula-inicio/aula-comentarios/aula-comentarios.component';
import { AulaAsignacionesComponent } from './aula-detail/aula-form/aula-asignaciones/aula-asignaciones.component';
import { AulaAsignacionComponent } from './aula-detail/aula-form/aula-asignaciones/aula-asignacion/aula-asignacion.component';
import { AulaParticipantesComponent } from './aula-detail/aula-form/aula-participantes/aula-participantes.component';
import { AulaCalificacionesComponent } from './aula-detail/aula-form/aula-calificaciones/aula-calificaciones.component';
import { AulaInnerListComponent } from './aula-detail/aula-form/aula-calificaciones/aula-inner-list/aula-inner-list.component';

@NgModule({
  declarations: [
    BarDirectoryComponent,
    AulaDetailComponent, 
    AulaExplorerComponent, 
    AulaListComponent, 
    AulaFormComponent, 
    AulaInicioComponent,
    AulaComentariosComponent,
    AulaAsignacionesComponent, 
    AulaAsignacionComponent,
    AulaParticipantesComponent,
    AulaCalificacionesComponent,
    AulaInnerListComponent
  ],
  imports: [
    SharedModule,
    AulaRoutingModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatChipsModule,
    MatTreeModule,
    MatListModule,
    MatExpansionModule
  ]
})
export class AulaModule { }
