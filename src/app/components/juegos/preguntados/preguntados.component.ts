import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiSimpsonsService } from 'src/app/servicios/api-simpsons.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})
export class PreguntadosComponent {
  user: any = null;
  listOfCountries: any = [];
  listOfQuestions: any = [];
  victory: boolean = false;
  activeGame: boolean = false;
  gameOver: boolean = false;
  gameOverText: string = 'PERDISTE :(';
  score: number = 0;
  attempts: number = 10;
  currentQuestion: any = null;
  //loadedQuestions: boolean = false;
  currentIndex: number = 0;
  correctAnswer: boolean = false;
  wrongAnswer: boolean = false;
  ocupacion: string='';
  personajesFiltrados: any;

  constructor(
    private router: Router,
    private apiPaises: ApiSimpsonsService,
    private notifyService: NotificacionesService,
    private firebase: FirebaseService
  ) {
    this.apiPaises.getPaises();
  }

  async ngOnInit(): Promise<void> {
    const paises = await this.apiPaises.getPaises();
    //console.log(paises.docs);
    this.personajesFiltrados = paises.docs.filter((respuesta: any) => respuesta.Ocupacion != "Desconocido" && respuesta.Ocupacion != "Desconocida" && respuesta.Ocupacion != "")
    console.log(this.personajesFiltrados);
    this.listOfCountries = await this.personajesFiltrados.map((country: any) => {
      //console.log(country.Nombre);

      return {
        name: country.Nombre,
        flag: country.Imagen,
        ocupacion: country.Ocupacion
      };

    });
    //console.log(this.listOfCountries);
    this.startGame();
  }

  startGame() {
    this.generateQuestions();
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    console.log(this.currentQuestion);
    this.ocupacion = this.listOfQuestions[this.currentIndex].ocupacion;

    this.activeGame = true;
    this.notifyService.mostrarInfo('Juego iniciado', 'Preguntados', 2000, "toast-top-center");
  } // end of startGame

  generateQuestions() {
    this.listOfCountries.sort(() => Math.random() - 0.5);
    this.listOfQuestions = this.listOfCountries
      .slice(0, 10)
      .map((country: any) => {

        let num1 = this.generateRandomNumber();
        let num2 = this.generateRandomNumber();
        let num3 = this.generateRandomNumber();

        while(num2 == num1 || num2 == num3){
          num2 = this.generateRandomNumber();
        }

        while(num3 == num1 || num3 == num2){
          num3 = this.generateRandomNumber();
        }

        const option2 = this.listOfCountries[num1];
        const option3 = this.listOfCountries[num2];
        const option4 = this.listOfCountries[num3];
        const options = [country, option2, option3, option4].sort(
          () => Math.random() - 0.5
        );
        //this.ocupacion = country.ocupacion;
        return {
          answer: country.name,
          options: options,
          flag: country.flag,
          ocupacion: country.ocupacion
        };
      });
   // this.loadedQuestions = true;
  } // end of generateQuestions

  generateRandomNumber() {
    return Math.floor(Math.random() * 300);
  } // end of generateRandomNumber

  play(option: string, event: Event) {
    this.ocupacion = "";

    if (this.activeGame) {
      const btn = <HTMLButtonElement>event.target;
      btn.disabled = true;
      if (option === this.currentQuestion.answer) {
        this.score++;
        this.correctAnswer = true;
        setTimeout(() => {
          this.correctAnswer = false;
        }, 300);
        this.notifyService.mostrarSuccess('Correcto!', 'Preguntados', 2000, "toast-top-center");
      } else {
        this.wrongAnswer = true;
        setTimeout(() => {
          this.wrongAnswer = false;
        }, 300);
        this.notifyService.mostrarError(
          `Incorrecto! Era ${this.currentQuestion.answer}`,
          'Preguntados', 2000, "toast-top-center"
        );
      }

      if (this.currentIndex < 9) {
        this.currentIndex++;
        //setTimeout(() => {
          this.currentQuestion = this.listOfQuestions[this.currentIndex];
          this.ocupacion = this.listOfQuestions[this.currentIndex].ocupacion;
//          console.log("durante el current",this.ocupacion)
        //}, 500);
        //console.log("despues del current",this.ocupacion)
      }

      if (this.attempts > 0) {
        this.attempts--;
        if (this.attempts === 0) {
          this.activeGame = false;
          this.gameOver = true;
          if (this.score >= 4) {
            this.victory = true;
            this.gameOverText = '¡GANASTE!';
            this.notifyService.mostrarSuccess('GANASTE!', 'Preguntados', 2000, "toast-top-center");
            this.firebase.guardarResultado(this.score, "preguntados");
            console.log(this.ocupacion);
          } else {
            this.notifyService.mostrarError('¡PERDISTE!', 'Preguntados', 2000, "toast-top-center");
            this.firebase.guardarResultado(this.score, "preguntados");
            console.log(this.ocupacion);
          }
        }
      }
    }
  }

  restartGame() {
    this.startGame();
    this.currentIndex = 0;
    this.score = 0;
    this.attempts = 10;
    this.activeGame = true;
    this.victory = false;
    this.gameOver = false;
    this.gameOverText = 'PERDISTE :(';
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    this.notifyService.mostrarInfo('Juego Reiniciado', 'Preguntados', 2000, "toast-top-center");
  }
}
