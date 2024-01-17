import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-menu-juegos',
  templateUrl: './menu-juegos.component.html',
  styleUrls: ['./menu-juegos.component.css']
})
export class MenuJuegosComponent {
  estaLogueado?:boolean;

  constructor(private firebase: FirebaseService){}

  ngOnInit(){
    this.estaLogueado = this.firebase.Logueado;
  }
}
