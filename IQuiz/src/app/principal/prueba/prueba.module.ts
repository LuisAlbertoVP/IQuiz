import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PruebaRoutingModule } from './prueba-routing.module';
import { PruebaDetailComponent } from './prueba-detail/prueba-detail.component';
import { PruebaListComponent } from './prueba-list/prueba-list.component';
import { PruebaFormComponent } from './prueba-detail/prueba-form/prueba-form.component';
import { PruebaPreguntaComponent } from './prueba-detail/prueba-form/prueba-pregunta/prueba-pregunta.component';
import { PruebaTablaComponent } from './prueba-detail/prueba-form/prueba-pregunta/prueba-tabla/prueba-tabla.component';
import { PruebaTablaDirective } from './prueba-detail/prueba-form/prueba-pregunta/prueba-tabla/prueba-tabla.directive';
import { PruebaLiteralComponent } from './prueba-detail/prueba-form/prueba-pregunta/prueba-literal/prueba-literal.component';
import { PruebaInfoComponent } from './prueba-detail/prueba-info/prueba-info.component';
import { PruebaInnerTablaComponent } from './prueba-detail/prueba-info/prueba-inner-tabla/prueba-inner-tabla.component';
import { PruebaInnerLiteralesComponent } from './prueba-detail/prueba-info/prueba-inner-literales/prueba-inner-literales.component';

@NgModule({
  declarations: [
    PruebaListComponent,
    PruebaDetailComponent, 
    PruebaFormComponent, 
    PruebaPreguntaComponent,  
    PruebaTablaComponent, 
    PruebaTablaDirective,
    PruebaLiteralComponent,
    PruebaInfoComponent,
    PruebaInnerTablaComponent,
    PruebaInnerLiteralesComponent
  ],
  imports: [
    SharedModule,
    PruebaRoutingModule
  ]
})
export class PruebaModule { }
