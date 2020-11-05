import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CuestionarioRoutingModule } from './cuestionario-routing.module';
import { BarDirectoryComponent } from './bar-directory/bar-directory.component';
import { CuestionarioExplorerComponent } from './cuestionario-explorer/cuestionario-explorer.component';
import { CuestionarioListComponent } from './cuestionario-explorer/cuestionario-list/cuestionario-list.component';
import { CuestionarioDetailComponent } from './cuestionario-detail/cuestionario-detail.component';
import { CuestionarioFormComponent } from './cuestionario-detail/cuestionario-form/cuestionario-form.component';
import { CuestionarioPreguntaComponent } from './cuestionario-detail/cuestionario-form/cuestionario-pregunta/cuestionario-pregunta.component';
import { CuestionarioTablaComponent } from './cuestionario-detail/cuestionario-form/cuestionario-pregunta/cuestionario-tabla/cuestionario-tabla.component';
import { CuestionarioLiteralComponent } from './cuestionario-detail/cuestionario-form/cuestionario-pregunta/cuestionario-literal/cuestionario-literal.component';

@NgModule({
  declarations: [ 
    BarDirectoryComponent, 
    CuestionarioExplorerComponent,
    CuestionarioListComponent,
    CuestionarioDetailComponent, 
    CuestionarioFormComponent, 
    CuestionarioPreguntaComponent,
    CuestionarioTablaComponent, 
    CuestionarioLiteralComponent
  ],
  imports: [
    SharedModule,
    CuestionarioRoutingModule
  ]
})
export class CuestionarioModule { }
