import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal, {SweetAlertIcon} from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private notificaciones: ToastrService) { }

  mostrarSuccess(mensaje:string, titulo:string, tiempo:number, posicion:string){
    this.notificaciones.success(mensaje, titulo, {
      timeOut:tiempo,
      positionClass:posicion
    })
  }

  mostrarWarning(mensaje:string, titulo:string, tiempo:number, posicion:string){
    this.notificaciones.warning(mensaje, titulo, {
      timeOut:tiempo,
      positionClass:posicion
    })
  }

  mostrarError(mensaje:string, titulo:string, tiempo:number, posicion:string){
    this.notificaciones.error(mensaje, titulo, {
      timeOut:tiempo,
      positionClass:posicion
    })
  }

  mostrarInfo(mensaje:string, titulo:string, tiempo:number, posicion:string){
    this.notificaciones.info(mensaje, titulo, {
      timeOut:tiempo,
      positionClass:posicion
    })
  }

  mostrarSweetAlert(mensaje:string, titulo:string, icono:SweetAlertIcon) {
    Swal.fire(titulo, mensaje, icono);
  }
}
