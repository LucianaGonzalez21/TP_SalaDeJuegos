import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent {
  juegoTxt: string="";
  nombreJuego: string="";
  resultados: any =[];
  seBuscoJuego: boolean= false;
  obser$: any;
  puntos: string ="";

  constructor(public firebase: FirebaseService, private notificaciones: NotificacionesService) { }
  estaLogueado = false;
  

  ngOnInit() {
    this.estaLogueado = this.firebase.Logueado;

  }

  ngOnDestroy() {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }
  }

  seEncontroJuego(palabra: string)
  {

    if(palabra == "pingPong" || palabra == "preguntados" || palabra == "mayor o menor" || palabra == "ahorcado")
    {
      this.obser$ = this.firebase.TraerResultados(palabra).subscribe(datos =>{
        this.AgregarHistorial(datos);
      });
      switch (palabra) 
      {
        case "pingPong":
          this.puntos = "∞";
          break;
        case "preguntados":
          this.puntos = "10";
          break;
        case "mayor o menor":
          this.puntos = "10";
          break;
        case "ahorcado":
          this.puntos = "6";
          break;
      }
      this.seBuscoJuego = true;
      this.nombreJuego = palabra.toLocaleUpperCase();
    }
    else
    {
      this.seBuscoJuego = false;
    }
  }

  AgregarHistorial(arrayAux: Array<any>)
  {
    let arrayNuevo =[];

    for (let i = 0; i < arrayAux.length; i++) 
    {
      arrayNuevo.push(arrayAux[i]);
    }

    this.resultados=arrayNuevo;
  }
}
