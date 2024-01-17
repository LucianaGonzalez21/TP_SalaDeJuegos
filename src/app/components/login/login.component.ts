import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  arrayUsuarios : any = [];
  referenciaObservable? : Subscription;

  constructor(private firebase: FirebaseService, private formBuilder: FormBuilder, private router: Router) {
  }

  
  get emailTs() {
    return this.formularioIngreso.get("emailControlador") as FormControl;
  }
  
  get claveTs() {
    return this.formularioIngreso.get("claveControlador") as FormControl;
  }

  ngOnDestroy(): void {
    if(this.referenciaObservable != null){
      this.referenciaObservable.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.referenciaObservable = this.firebase.recuperarUsuarios().subscribe(datos => {
      this.arrayUsuarios = datos;
    })
  }

  public formularioIngreso = this.formBuilder.group(
    {
      'emailControlador': ['', [Validators.email, Validators.required, this.validarEspaciosVacios, Validators.pattern(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)]],
      'claveControlador': ['', [Validators.required, Validators.minLength(6)]]
    }
  );

  private validarEspaciosVacios(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null;
  }

  async ingreso() {
    let nombre = this.recuperarNombreDeUsuario(this.emailTs.value);
    await this.firebase.ingresarConEmailYClave(this.emailTs.value, this.claveTs.value, nombre);
  }

  accederRapido(usuario: string) {
    this.claveTs.setValue("123456");
    switch (usuario) {
      case "admin":
        this.emailTs.setValue("admin@admin.com");
      break;
      case "invitado":
        this.emailTs.setValue("invitado@invitado.com");
        break;
      case "usuario":
        this.emailTs.setValue("usuario@usuario.com");
        break;
    }
  }

  recuperarNombreDeUsuario(email:string){
    let nombre = "";

    for(const unUsuario of this.arrayUsuarios){
      if(unUsuario.email == email){
        nombre = unUsuario.nombre;
        break;
      }
    }

    return nombre;
  }
}
