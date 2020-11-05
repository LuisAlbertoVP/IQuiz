import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CuentaRoutingModule } from './cuenta-routing.module';
import { ConfiguracionComponent } from './configuracion/configuracion.component';


@NgModule({
  declarations: [ConfiguracionComponent],
  imports: [
    SharedModule,
    CuentaRoutingModule
  ]
})
export class CuentaModule { }
