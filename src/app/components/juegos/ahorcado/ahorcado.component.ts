import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent {
  user: any = null;
  buttonLetters: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    // 'Ñ',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  listOfWords: string[] = [
    'PINTURA','ESCULTURA','MUSICA','DANZA','TEATRO','LITERATURA','CINE','ARQUITECTURA','DIBUJO',
    'GRABADO','ESCENARIO','ACTUACION','COREOGRAFIA','COMPOSICION','POESIA','ESCENOGRAFIA','EXPRESIONISMO',
    'REALISMO','ABSTRACCION','RENACIMIENTO','BARROCO','ROMANTICISMO','IMPRESIONISMO','MODERNISMO','CUBISMO',
    'SURREALISMO','INSTALACION','PINCEL','LIENZO','MARMOL','ARCILLA','PARTITURA',
    'BALLET','OPERA','DRAMA','NOVELA','CINEASTA','ARQUITECTO','ESCRITOR','ESCULTOR','MUSICO','ACTOR',
    'DIRECTORA','ILUSTRACION','MUSEO','EXPOSICION','CREATIVIDAD',
  ];
  victory: boolean = false;
  activeGame: boolean = true;
  attempts: number = 0;
  score: number = 0;
  image: number | any = 0;
  word: string = '';
  hyphenatedWord: string[] = [];

  constructor(private notificaciones: NotificacionesService, private firebase:FirebaseService) 
  {
    this.word = this.listOfWords[
        Math.round(Math.random() * (this.listOfWords.length - 1))
      ];
    this.hyphenatedWord = Array(this.word.length).fill('_');
  }

  restartGame() 
  {
    this.word =
      this.listOfWords[Math.round(Math.random() * (this.listOfWords.length - 1))];
    this.hyphenatedWord = Array(this.word.length).fill('_');
    this.activeGame = true;
    this.attempts = 0;
    this.score = 0;
    this.image = 0;
    this.victory = false;
    this.resetClassBotones();
    //this.notificaciones.mostrarInfo('Reiniciando partida...', 'Ahorcado', 3000, "toast-top-center");
  }

  resetClassBotones(){
    for (let index = 0; index < this.buttonLetters.length; index++) {
      const elemento = document.getElementById("boton"+index) as HTMLButtonElement;
      elemento?.classList.remove("btn-error");
      elemento?.classList.remove("btn-acierto");
      elemento?.classList.add("btn-letra");
      if(elemento!=null)
      {
        elemento.disabled = false;
      }

    }
  }

  sendLetter(letter: string, idDelBoton:number) {
    let letterFlag: boolean = false;
    let winGame: boolean = false;

    if (this.activeGame) {
      const alreadyGuessedLetterFlag: boolean = this.hyphenatedWord.some(
        (c) => c === letter
      );
      for (let i = 0; i < this.word.length; i++) {
        const wordLetter = this.word[i];
        if (wordLetter === letter && !alreadyGuessedLetterFlag) {
          this.hyphenatedWord[i] = letter;
          letterFlag = true;
          this.score++;
          winGame = this.hyphenatedWord.some((hyphen) => hyphen == '_');
          if (!winGame) {
            this.activeGame = false;
            this.victory = true;
            //this.notificaciones.mostrarSuccess('Excelente Ganaste!!', 'Ahorcado', 3000, "toast-top-center");
            this.notificaciones.mostrarSweetAlert("GANASTE", "Tu puntaje es " + this.score, "success");
            this.firebase.guardarResultado(this.score, "ahorcado");
            break;
          }
        }
      }

      if (!letterFlag && !alreadyGuessedLetterFlag) {
        if (this.attempts >= 0) {
          this.attempts++;
          this.image++;
          this.notificaciones.mostrarError('¡Te equivocaste!', 'Ahorcado', 3000, "toast-top-center");
          const elemento = document.getElementById("boton"+idDelBoton) as HTMLButtonElement;
          elemento?.classList.remove("btn-letra");
          elemento?.classList.add("btn-error");
          if(elemento!=null)
          {
            elemento.disabled = true;
          }
          if (this.attempts === 6) {
            //this.notificaciones.mostrarInfo(`La palabra era: ${this.word}`, 'Ahorcado', 3000, "toast-top-center");
            this.notificaciones.mostrarSweetAlert('PERDISTE', 'La palabra era: ' + this.word, "error");
            this.firebase.guardarResultado(this.score, "ahorcado");
            this.activeGame = false;
          }
        }

      } else if (alreadyGuessedLetterFlag) {
        this.notificaciones.mostrarWarning('Esta letra ya fue utilizada', 'Ahorcado', 3000, "toast-top-center");
      } else if (letterFlag) {
        if(!this.victory) {
          this.notificaciones.mostrarSuccess('Acertaste!!', 'Ahorcado', 3000, "toast-top-center");
          const elemento = document.getElementById("boton"+idDelBoton) as HTMLButtonElement;
          elemento?.classList.remove("btn-letra");
          elemento?.classList.add("btn-acierto");
          if(elemento!=null)
          {
            elemento.disabled = true;
          }
        }
      }
    } else {
      this.notificaciones.mostrarInfo(
        'Ya puedes jugar de nuevo',
        'Ahorcado', 3000, "toast-top-center"
      );
    }
  } 
}
