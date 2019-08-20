import * as PIXI from "pixi.js";
import { Player } from "../models/player.model";
import {
  interval,
  Observable,
  from,
  Observer,
  of,
  fromEvent,
  timer,
  iif,
  Subscribable,
  Subscription
} from "rxjs";
import {
  map,
  filter,
  reduce,
  tap,
  elementAt,
  bufferWhen,
  delay,
  last
} from "rxjs/operators";
import { Pipe } from "../models/pipe.model";
import {
  SPRITE_URLS,
  PHYSICS,
  CANVAS_SIZE
} from "../constants/game_config.constants";
import { CityBg } from "../models/city-bg.model";
import { ScoreService } from "../services/score.service";
declare const Bump: any;
export class MainController {
  private _app: any;
  private _player: any;
  private _bump: any;
  private _updateSuscription: Subscription;
  private _obstacleGenerationSubscription: Subscription;
  private _pressedKey$: Observable<any>;
  private _frameUpdate$: Observable<number>;
  private _backgroundUpdate$: Observable<any>;
  private _gui: any;
  private _skylineContainer: any;

  constructor(private view: Document, private scoreService: ScoreService) {
    this._setupPixi();
    this.init();
  }
  private _setupPixi() {
    this._app = new PIXI.Application({
      width: CANVAS_SIZE.WIDTH,
      height: CANVAS_SIZE.HEIGHT,
      antialias: true,
      transparent: false,
      backgroundColor: 0x1099bb
    });
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.view.body.appendChild(this._app.view);

    this._skylineContainer = new PIXI.Container();
    this._app.stage.addChild(this._skylineContainer);
  }
  init() {
    this._bump = new Bump(PIXI); //LIBRERÍA para detectar colisiones
    this._cacheGui();
    this._setObservables();
    this._setBackground();
    this._setSkyline();
    this._setPlayer();
    this._setObstacles();
    this._app.stage.setChildIndex(this._skylineContainer, 1);
  }
  private _cacheGui() {
    this._gui = {
      scoreboard: this.view.getElementById("scoreboard"),
      messages: this.view.getElementById("messages")
    };
  }

  private _setObservables() {
    this._frameUpdate$ = Observable.create((observer: Observer<number>) => {
      //  ESTE metodo es nativo de pixi, y es ejecutado cada frame.
      this._app.ticker.add((delta: number) => {
        observer.next(delta);
      });
    });

    this._pressedKey$ = fromEvent(document, "keydown");

    this._updateSuscription = this._frameUpdate$.subscribe(delta => {
      this._checkCollisions();
    });

    this._backgroundUpdate$ = interval(1000);

    //#region easter egg
    //"Easter egg". Si se presiona 6 veces cualquier tecla en 1 segundo, se muestra un mensaje
    this._pressedKey$
      .pipe(
        bufferWhen(() => this._pressedKey$.pipe(delay(1000))),
        filter((events: any) => events.length >= 7)
      )
      .subscribe(() => {
        this._gui.messages.innerHTML += "WOW, SOO POWER<br>";
      });
    //#endregion
    //this._pressedKeySubscription = this._pressedKey$.subscribe();
  }

  private _setBackground() {
    const bg = PIXI.Sprite.from(SPRITE_URLS.IMAGE_BACKGROUND);

    bg.anchor.set(0);
    bg.x = 0;
    bg.y = 0;
    this._app.stage.addChild(bg);
  }

  private _setPlayer() {
    this._player = new Player(
      this._app.stage,
      this._frameUpdate$,
      this._pressedKey$
    );
    console.log(this._player);
  }

  private _setSkyline() {
    this._createSkylinePiece(0);
    this._backgroundUpdate$.pipe().subscribe(val => this._createSkyline());
  }

  private _createSkyline() {
    from(this._skylineContainer.children)
      .pipe(
        last(),
        filter((skyline: any) => skyline.position.x <= CANVAS_SIZE.WIDTH)
      )
      .subscribe(({ position, width }) =>
        this._createSkylinePiece(position.x + width)
      );
  }

  private _createSkylinePiece(positionX: number) {
    new CityBg(this._skylineContainer, this._frameUpdate$, {
      x: positionX,
      y: CANVAS_SIZE.HEIGHT
    });
  }

  private _setObstacles() {
    // OPERADOR que espera X tiempo antes de empezar el intervalo.
    this._obstacleGenerationSubscription = timer(
      PHYSICS.PIPE_GENERATION_FIRST_WAIT,
      PHYSICS.PIPE_GENERATION_INTERVAL
    ).subscribe(val => {
      this._createPipe();
      this._deletePipes();
      this._updateScore();
    });
  }

  /*************** */
  private _createPipe() {
    new Pipe(this._app.stage, this._frameUpdate$);
  }

  private _deletePipes() {
    from(this._app.stage.children)
      .pipe(
        filter((pipe: any) => pipe !== undefined),
        filter(({ type }) => type === "pipe"),
        filter((pipe: any) => pipe.position.x < 0)
      )
      .subscribe((pipe: any) => {
        this._app.stage.removeChild(pipe);
      });
  }

  private _updateScore() {
    this.scoreService.add();
    this._gui.scoreboard.innerHTML = this.scoreService.score + "";
  }

  private _checkCollisions() {
    from(this._app.stage.children)
      .pipe(
        filter((element: any) => element.type === "pipe"),
        reduce(
          (acc, pipe) => this._bump.hit(this._player.sprite, pipe) || acc,
          false
        ),
        filter((isHit: boolean) => isHit)
      )
      .subscribe(hit => {
        this._gameOver();
      });
  }

  private _gameOver() {
    this._unsubscribe();
    this._showGameoverInfo();

    from(this._app.stage.children)
      // Comprobar si el objeto posee la propiedad gameOver (es decir, puede ser """asesinado""")
      .pipe(filter((element: any) => typeof element.gameOver !== "undefined"))
      .subscribe((element: any) => {
        element.gameOver();
      });

    timer(600).subscribe(() => this._waitToRestart()); //Evita que se pueda reiniciar el nivel instantaneamente.
    //setTimeout(() => this._waitToRestart(), 500);     //Evita que se pueda reiniciar el nivel instantaneamente. (version clasica)
  }

  private _showGameoverInfo() {
    const gameOverSprite = PIXI.Sprite.from(SPRITE_URLS.GAME_OVER_TEXT);
    gameOverSprite.anchor.set(0.5);
    gameOverSprite.position.set(CANVAS_SIZE.WIDTH / 2, CANVAS_SIZE.HEIGHT / 3);
    gameOverSprite.scale.set(10);
    this._app.stage.addChild(gameOverSprite);
  }

  private _waitToRestart() {
    console.log("Waiting");
    this._pressedKey$.subscribe(() => {
      this._resetGame();
    });
  }

  private _unsubscribe() {
    this._updateSuscription.unsubscribe();
    this._obstacleGenerationSubscription.unsubscribe();
  }

  private _resetGame() {
    /*Deletes sprites */
    //this.app.stage.destroy(true);
    location.reload();
  }
}
