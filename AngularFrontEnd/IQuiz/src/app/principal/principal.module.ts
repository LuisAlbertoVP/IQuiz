import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { PrincipalRoutingModule } from './principal-routing.module';
import { AdminModule } from './admin/admin.module';
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
    AdminModule,
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
