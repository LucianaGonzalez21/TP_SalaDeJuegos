import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements AfterViewChecked{

  nombre? = "";
  logueado = false;

  constructor(private firebase:FirebaseService, private cdRef: ChangeDetectorRef, private router: Router){
  }
  
  ngAfterViewChecked(): void {
    this.nombre =this.firebase.Nombre?.toUpperCase();
    this.logueado = this.firebase.Logueado;
    this.cdRef.detectChanges(); 

  }

  salir(){
    this.firebase.logout();
    this.router.navigateByUrl('home');
  }

}
