import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  estaLogueado?:boolean;

  constructor(private firebase: FirebaseService){}

  ngOnInit(){
    this.estaLogueado = this.firebase.Logueado;
  }
}
