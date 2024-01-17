import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuegosComponent } from './juegos.component';
import { AhorcadoComponent } from '../components/juegos/ahorcado/ahorcado.component';
import { MenuJuegosComponent } from '../components/menu-juegos/menu-juegos.component';
import { MayorMenorComponent } from '../components/juegos/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../components/juegos/preguntados/preguntados.component';
import { PongComponent } from '../components/juegos/pong/pong.component';

const routes: Routes = [
  { path: '', component: JuegosComponent, 
    children: [
      {path:'', title:"Juegos", component:MenuJuegosComponent},
      {path:'ahorcado', title:"Ahorcado", component:AhorcadoComponent},
      {path:'mayor-menor', title:"Mayor o menor", component:MayorMenorComponent},
      {path:'preguntados', title:"Preguntados", component:PreguntadosComponent},
      {path:'pong', title:"Ping Pong", component:PongComponent},
    ]
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
