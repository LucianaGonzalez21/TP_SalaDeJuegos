import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Controls } from '../../../enums/controls';
import { PongGame } from '../../../clases/pong-game';
import { Boundaries } from '../../../clases/boundaries';
import { ControlState } from '../../../clases/control-state';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
})
export class PongComponent {
  @ViewChild('PongCanvas') canvasElement!: ElementRef

  public width: number = 800;
  public height: number = 600;

  private context!: CanvasRenderingContext2D;
  public pongGame: PongGame;
  private ticksPerSecond: number = 60;

  private controlState: ControlState;
  public gameOver = false;

  public botonEmpezar:boolean=false;


  constructor(private firebase: FirebaseService) {
    this.pongGame = new PongGame(this.height, this.width);
    this.controlState = { upPressed: false, downPressed: false };
  }

  ngOnInit() {
    //this.context = this.canvasElement.nativeElement.getContext('2d');
    this.context = (<any>document.getElementById("canvasa")).getContext('2d');
    this.renderFrame();

    // Game model ticks 60 times per second. Doing this keeps same game speed
    // on higher FPS environments.
    //setInterval(() => this.pongGame.tick(this.controlState), 1 / this.ticksPerSecond);
  }

  renderFrame(): void {
    // Only run if game still going
    if (this.pongGame.gameOver()) {
      this.context.font = "30px Arial";
      this.context.fillText("Game Over!", 50, 50);
      this.gameOver = true;
      this.firebase.guardarResultado(this.pongGame.hits, "pingPong");
      return;
    }

    // Draw background
    this.context.fillStyle = 'rgb(0,0,0)';
    this.context.fillRect(0, 0, this.width, this.height);

    // Set to white for game objects
    this.context.fillStyle = 'rgb(255,255,255)';

    let bounds: Boundaries;

    // Draw player paddle
    let paddleObj = this.pongGame.playerPaddle;
    bounds = paddleObj.getCollisionBoundaries();
    this.context.fillRect(bounds.left, bounds.top, paddleObj.getWidth(), paddleObj.getHeight());

    // Draw enemy paddle
    let enemyObj = this.pongGame.enemyPaddle;
    bounds = enemyObj.getCollisionBoundaries();
    this.context.fillRect(bounds.left, bounds.top, enemyObj.getWidth(), enemyObj.getHeight());

    // Draw ball
    let ballObj = this.pongGame.ball;
    bounds = ballObj.getCollisionBoundaries();
    this.context.fillRect(bounds.left, bounds.top, ballObj.getWidth(), ballObj.getHeight());

    // Render next frame
    window.requestAnimationFrame(() => this.renderFrame());
  }


  volverJugar() {
    this.pongGame = new PongGame(this.height, this.width);
    //this.controlState = { upPressed: false, downPressed: false };
    this.context = (<any>document.getElementById("canvasa")).getContext('2d');
    this.renderFrame();
    this.gameOver = false;
  }

  empezarJuego(){
    this.botonEmpezar=true;
    setInterval(() => this.pongGame.tick(this.controlState), 1 / this.ticksPerSecond);
  }

  @HostListener('window:keydown', ['$event'])
  keyUp(event: KeyboardEvent) {
    if (event.keyCode == Controls.Up) {
      this.controlState.upPressed = true;
    }
    if (event.keyCode == Controls.Down) {
      this.controlState.downPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.keyCode == Controls.Up) {
      this.controlState.upPressed = false;
    }
    if (event.keyCode == Controls.Down) {
      this.controlState.downPressed = false;
    }
  }

}
