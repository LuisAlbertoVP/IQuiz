import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { PrincipalRoutingModule } from './principal-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminModule } from './admin/admin.module';
import { CuentaModule } from './cuenta/cuenta.module';
import { CuestionarioModule } from './cuestionario/cuestionario.module';
import { PruebaModule } from './prueba/prueba.module';
import { AulaModule } from './aula/aula.module';
import { PrincipalComponent } from './principal.component';
import { HttpErrorHandlerService } from '../http-error-handler.service';
import { httpInterceptorProviders } from '../http-interceptors';

@NgModule({
  declarations: [PrincipalComponent],
  imports: [
    SharedModule,
    PrincipalRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    AdminModule,
    CuentaModule,
    CuestionarioModule,
    PruebaModule,
    AulaModule
  ],
  providers: [
    HttpErrorHandlerService,
    httpInterceptorProviders
  ],
})
export class PrincipalModule { }
