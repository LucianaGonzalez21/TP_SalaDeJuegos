import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { NotificacionesService } from './notificaciones.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { formatDate } from '@angular/common';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private nombre? : string;
  private email? : string;
  private logueado : boolean;
  
  public get Nombre() {
    return this.nombre;
  }

  
  public get Email() {
    return this.email;
  }
  
  public get Logueado() : boolean {
    return this.logueado;
  }
  

  constructor(private authenticator: AngularFireAuth, private router: Router, private notificaciones: NotificacionesService, private firebase: AngularFirestore) {
    this.nombre = "";
    this.logueado = false;
   }

  ingresarConEmailYClave(email: string, clave: string, nombre? :string) {
    this.authenticator.signInWithEmailAndPassword(email, clave).then(respuesta => (
      this.notificaciones.mostrarSuccess("EXITO", "exito", 3000, "toast-top-center"),
      this.nombre = nombre,
      this.email = email,
      this.router.navigateByUrl("home"),
      this.logueado = true,
      this.logUsuario(nombre, email)
    ))
      .catch(error => (
        this.mensajeError(error.code)
      ))
  }

  private mensajeError(mensaje: string) {
    switch (mensaje) {
      case 'auth/user-not-found':
        this.notificaciones.mostrarError('El usuario no se encuentra registrado', "ERROR", 3000, "toast-center-center");
        break;
      case 'auth/wrong-password':
        this.notificaciones.mostrarError('La contraseña es incorrecta', "ERROR", 3000, "toast-center-center");
        break;
      case 'auth/internal-error':
        this.notificaciones.mostrarError('Los campos estan vacios', "ERROR", 3000, "toast-center-center");
        break;
      case 'auth/operation-not-allowed':
        this.notificaciones.mostrarError('La operación no está permitida.', "ERROR", 3000, "toast-center-center");
        break;
      case 'auth/email-already-in-use':
        this.notificaciones.mostrarError('El email ya está registrado.', "ERROR", 3000, "toast-center-center");
        break;
      case 'auth/invalid-email':
        this.notificaciones.mostrarError('El email no es valido.', "ERROR", 3000, "toast-center-center");
        break;
      case 'auth/weak-password':
        this.notificaciones.mostrarError('La contraseña debe tener al menos 6 caracteres', "ERROR", 3000, "toast-center-center");
        break;
      default:
        this.notificaciones.mostrarError('default', "ERROR", 3000, "toast-center-center");
        break;
    }
  }

  logout() {
    this.authenticator.signOut();
    this.notificaciones.mostrarSuccess("logout exitoso", "EXITO", 2000, "toast-top-right");
    this.router.navigateByUrl("home");
    this.nombre = "";
    this.logueado = false;
  }

  guardarUsuario(usuario: any) {
    //creo usuario en el autenticador (email y clave)
    this.authenticator.createUserWithEmailAndPassword(usuario.email, usuario.clave).then((data) => {
      this.notificaciones.mostrarSuccess("Registro exitoso", "EXITO", 3000, "toast-top-center")
      const uid = data.user?.uid  //tomo el uid del usuario creado
      const documento = this.firebase.doc("usuarios/" + uid)  //con el id busco el usuario
      //establezco los valores de las variables
      documento.set({
        uid: uid,
        nombre: usuario.nombre,
        email: usuario.email,
        clave: usuario.clave
      })
      this.ingresarConEmailYClave(usuario.email, usuario.clave, usuario.nombre)
    }).catch(error => {
      this.mensajeError(error.code);
    })
  }

  recuperarUsuarios(){
    const coleccionUsuarios = this.firebase.collection("usuarios");
    return coleccionUsuarios.valueChanges();
  }

  logUsuario(nombre:string|undefined, email:string){
    let fecha : string =  formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US');
    console.log(fecha);
    const coleccionLogs = this.firebase.collection("logs");
    coleccionLogs.add(
      {
        usuario: nombre,
        email: email,
        fecha: fecha
      }
    )
  }

  enviarMensajeChat(mensaje:string, usuario: string|undefined){
    let fecha : string =  formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US');
    const coleccionChat = this.firebase.collection('chats');
    coleccionChat.add(
      {
        usuario: usuario,
        mensaje: mensaje, 
        fecha: fecha
      }
    )
  }

  traerMensajesChat(){
    const coleccionChats = this.firebase.collection('chats', ref => ref.orderBy('fecha'));
    return coleccionChats.valueChanges();
  }

  guardarResultado(puntos: number, nombreJuego: string)
  {
    let objetoJSData = { email: this.Email, 
                         nombre: this.Nombre,
                         fecha: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                         puntos: puntos,
                         juego: nombreJuego
    };

    return this.firebase.collection("resultadosJuego").add(objetoJSData);
  }

  TraerResultados(nombreJuego: string)
  {
    const coleccion = this.firebase.collection('resultadosJuego' , ref =>
      ref.where("juego", "==", nombreJuego).orderBy("fecha", "asc")
    );
    return coleccion.valueChanges();
  }

  guardarRespuestaEncuesta(respuetas: object){
    return this.firebase.collection('respuestas-encuesta').add(respuetas);
  }

}
