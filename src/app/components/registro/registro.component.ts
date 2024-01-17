import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  constructor(private formBuilder:FormBuilder, private firebase:FirebaseService){}

  get nombre() {
    return this.formularioRegistro.get("nombre") as FormControl;
  }
  get email() {
    return this.formularioRegistro.get("email") as FormControl;
  }

  get clave() {
    return this.formularioRegistro.get("clave") as FormControl;
  }

  get confirmacionClave() {
    return this.formularioRegistro.get("claveConfirmacion") as FormControl;
  }

  public formularioRegistro= this.formBuilder.group(
    {
      'nombre': ['', [Validators.required, this.validarEspaciosVacios]],
      'email': ['',  [Validators.email, Validators.required, this.validarEspaciosVacios, Validators.pattern(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)]],
      'clave': ['', [Validators.required, Validators.minLength(6)]],
      'claveConfirmacion': ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators : this.validarContraseniasCoincidan}
  );

  validarContraseniasCoincidan(group: FormGroup): null | object {
    const clave: string = group.get('clave')?.value;
    const claveConfirmacion: string = group.get('claveConfirmacion')?.value;
    if (clave !== claveConfirmacion) {
      return { 'notEquivalent': true };
    }
    else {
      return null;
    }
  }

  private validarEspaciosVacios(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null;
  }

  registrar(){
    const usuario = {
      nombre: this.nombre.value,
      email: this.email.value,
      clave: this.clave.value
    }

    this.firebase.guardarUsuario(usuario);
  }
}
