import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrincipalComponent } from './principal.component';
import { UsuarioListComponent } from './admin/usuario-list/usuario-list.component';
import { UsuarioDetailComponent } from './admin/usuario-detail/usuario-detail.component';
import { CuestionarioExplorerComponent } from './cuestionario/cuestionario-explorer/cuestionario-explorer.component';
import { CuestionarioDetailComponent } from './cuestionario/cuestionario-detail/cuestionario-detail.component';
import { PruebaListComponent } from './prueba/prueba-list/prueba-list.component';
import { PruebaDetailComponent } from './prueba/prueba-detail/prueba-detail.component';
import { AulaExplorerComponent } from './aula/aula-explorer/aula-explorer.component';
import { AulaDetailComponent } from './aula/aula-detail/aula-detail.component';
import { CursoListComponent } from './admin/curso-list/curso-list.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',  
    component: PrincipalComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'usuarios',  component: UsuarioListComponent },
          { path: 'usuario',  component: UsuarioDetailComponent },
          { path: 'usuario/:id',  component: UsuarioDetailComponent },
          { path: 'cursos',  component: CursoListComponent },
          { path: 'cuestionarios/:id',  component: CuestionarioExplorerComponent },
          { path: 'cuestionario/:id', component: CuestionarioDetailComponent },
          { path: 'pruebas', component: PruebaListComponent },
          { path: 'prueba/:id', component: PruebaDetailComponent },
          { path: 'aulas/:id', component: AulaExplorerComponent },
          { path: 'aula/:id/:curso', component: AulaDetailComponent }
        ]
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule { }
