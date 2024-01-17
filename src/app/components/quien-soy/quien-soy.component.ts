import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quien-soy',
  templateUrl: './quien-soy.component.html',
  styleUrls: ['./quien-soy.component.css']
})
export class QuienSoyComponent implements OnInit, OnDestroy {

  estaLogueado?:boolean;
  ruta:string = "https://api.github.com/users/LucianaGonzalez21";
  datosGitHub:any;
  miSuscripcion:Subscription = new Subscription;

  constructor(private firebase: FirebaseService, private httpClient: HttpClient){
  }

  ngOnDestroy(): void {
    this.miSuscripcion.unsubscribe();
  }

  async ngOnInit(){
    this.estaLogueado = this.firebase.Logueado;
    this.miSuscripcion = this.httpClient.get(this.ruta).subscribe(datos => this.datosGitHub = datos );
  } 

}
