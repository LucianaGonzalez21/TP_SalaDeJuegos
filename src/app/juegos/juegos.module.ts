import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './juegos-routing.module';
import { JuegosComponent } from './juegos.component';
import { AhorcadoComponent } from '../components/juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../components/juegos/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../components/juegos/preguntados/preguntados.component';


@NgModule({
  declarations: [
    JuegosComponent,
    AhorcadoComponent,
    MayorMenorComponent,
    PreguntadosComponent,
  ],
  imports: [
    CommonModule,
    JuegosRoutingModule
  ]
})
export class JuegosModule { }
