import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  mostrarChat:boolean;
  mensaje:string;
  referenciaObservable? : Subscription;
  arrayChats:any;
  nombreUsuario?='';
  estaLogueado=false;

  mensajesDelChat = document.querySelector('.card-body')

  constructor(private firebase: FirebaseService){
    this.mensaje='';
    this.mostrarChat=false;
    this.arrayChats=[];
  }

  ngOnDestroy(): void {
    if(this.referenciaObservable != null){
      this.referenciaObservable.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.referenciaObservable = this.firebase.traerMensajesChat().subscribe(datos => {
      this.arrayChats = datos;
      console.log(this.referenciaObservable);
    })
  }
  
  ngAfterViewChecked(){
    this.nombreUsuario = this.firebase.Nombre;
    
    this.scrollToTheLastElementByClassName();

    this.estaLogueado=this.firebase.Logueado;

  }

  enviarMensaje(){
    console.log(this.mensaje);
    if(this.validarMensajeNoSeVacio()){
      this.firebase.enviarMensajeChat(this.mensaje, this.firebase.Nombre);
      this.mensaje='';
      setTimeout(() => {
        this.scrollToTheLastElementByClassName();
        
      }, 20);
    }else{
      console.log("mensaje vacio");
    }
  }

  validarMensajeNoSeVacio(){
    let mensajePrueba = this.mensaje.replace(/\s+/g, "");
    return mensajePrueba != "";
  }

  scrollToTheLastElementByClassName(){
    let elements = document.getElementsByClassName('msj');
    let ultimo:any = elements[(elements.length - 1)];
    if(ultimo != undefined){
      let toppos = ultimo.offsetTop;
      console.log(toppos)
      //@ts-ignore
      document.getElementById('contenedor-mensajes').scrollTop = toppos;
    }
  }
}
