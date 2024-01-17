import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent {

  estaLogueado?:boolean;

  ngOnInit(){
    this.estaLogueado = this.firebase.Logueado;
  }

  constructor(private formBuilder: FormBuilder, private firebase: FirebaseService, private notificaciones: NotificacionesService, private router: Router) { };

  get Nombre() {
    return this.formularioEncuesta.get("nombre") as FormControl;
  }

  get Apellido() {
    return this.formularioEncuesta.get("apellido") as FormControl;
  }

  get Edad() {
    return this.formularioEncuesta.get("edad") as FormControl;
  }

  get Telefono() {
    return this.formularioEncuesta.get("telefono") as FormControl;
  }

  get Comentario() {
    return this.formularioEncuesta.get("comentario") as FormControl;
  }

  public formularioEncuesta = this.formBuilder.group(
    {
      'nombre': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-z]+$')]],
      'apellido': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-z]+$')]],
      'edad': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[0-9]+$'), Validators.min(18), Validators.max(99)]],
      'telefono': ['', [Validators.required, this.validarEspaciosVacios, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
      'comentario': ['', [Validators.minLength(10), Validators.maxLength(100)]],
    }
  );

  private validarEspaciosVacios(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null;
  }

  obtenerValorRadio() {
    const selectedRadio = document.querySelector('input[name="estrellas"]:checked') as HTMLInputElement;
    if (selectedRadio) {
      const selectedValue = selectedRadio.value;
      return selectedValue;
    } else {
      console.log("Ningún botón de radio seleccionado.");
      return 0;
    }
  }

  obtenerValorCheckBox() {
    const checkboxes = document.querySelectorAll('input[name="juegos"]:checked');
    const selectedValues: string[] = [];

    checkboxes.forEach((value: Element) => {
      const checkbox = value as HTMLInputElement; // Conversión explícita
      selectedValues.push(checkbox.value);
    });

    return selectedValues;
  }

  enviarEncuesta() {
    let calificacion = this.obtenerValorRadio();
    if (calificacion == 0) {
      this.notificaciones.mostrarError("Debe calificar la página", "Encuesta", 1500, "toast-center-center")
    }

    let encuesta = {
      nombre: this.Nombre.value,
      apellido: this.Apellido.value,
      edad: this.Edad.value,
      telefono: this.Telefono.value,
      calificacionPagina: this.obtenerValorRadio(),
      juegos: this.obtenerValorCheckBox(),
      comentario: this.Comentario.value,
    }

    console.log(encuesta);

    this.firebase.guardarRespuestaEncuesta(encuesta).then(() => {
      this.notificaciones.mostrarSuccess("Gracias por tu tiempo", "Encuesta", 2000, "toast-top-center");
      this.router.navigateByUrl('home');
    }
    );
  }

}
