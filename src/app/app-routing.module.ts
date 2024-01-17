import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { ResultadoComponent } from './components/resultado/resultado.component';
import { EncuestaComponent } from './components/encuesta/encuesta.component';

const routes: Routes = [
  {path:"home", title:"Home", component:HomeComponent},
  {path:"", redirectTo:"home", pathMatch:"full"},
  {path:"login", title:"Login", component:LoginComponent},
  {path:"registro", title:"Registro", component:RegistroComponent},
  {path:"quien-soy", title:"Quien Soy", component:QuienSoyComponent},
  {path:"resultado", title:"Resultado", component:ResultadoComponent},
  {path:"encuesta", title:"Encuesta", component:EncuestaComponent},
  { path: 'juegos', loadChildren: () => import('./juegos/juegos.module').then(m => m.JuegosModule) },
  {path:"**", title:"404 Not Found", component:ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
