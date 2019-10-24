import * as PIXI from 'pixi.js';

import { CANVAS_SIZE, PHYSICS, SPRITE_URLS } from '../constants/game_config.constants';
import { Observable, Subject, Subscriber, fromEvent, interval, timer } from 'rxjs';
import { bufferTime, filter, first, takeUntil, tap } from 'rxjs/operators';

import { CityBg } from '../models/city-bg.model';
import { Pipe } from '../models/pipe.model';
import { Player } from '../models/player.model';
import { ScoreService } from '../services/score.service';

interface GUI {
  scoreboard: HTMLElement;
  messages: HTMLElement;
}

export class MainController {
  private app: PIXI.Application;
  private bump: any;
  private skylineContainer: PIXI.Container;

  private player: Player;
  private gui: GUI;

  private pressedKey$: Observable<KeyboardEvent>;
  private frameUpdate$: Observable<number>;
  private backgroundUpdate$: Observable<number>;
  private destroy$ = new Subject<void>();

  constructor(private view: Document, private scoreService: ScoreService) {
    this.bump = new Bump(PIXI); // LIBRERÍA para detectar colisiones

    this.gui = {
      scoreboard: this.view.getElementById('scoreboard'),
      messages: this.view.getElementById('messages'),
    };
  }

  public startGame() {
    this.setupPixi();
    this.init();
  }

  private setupPixi() {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.app = new PIXI.Application({
      width: CANVAS_SIZE.WIDTH,
      height: CANVAS_SIZE.HEIGHT,
      antialias: true,
      transparent: false,
      backgroundColor: 0x1099bb,
    });

    this.view.body.appendChild(this.app.view);

    this.skylineContainer = new PIXI.Container();
    this.app.stage.addChild(this.skylineContainer);
  }

  private init() {
    this.setObservables();
    this.setBackground();
    this.setSkyline();
    this.setPlayer();
    this.setObstacles();
    this.app.stage.setChildIndex(this.skylineContainer, 1);
  }

  private setObservables() {
    this.frameUpdate$ = new Observable((observer: Subscriber<number>) => {
      const listener = (delta: number) => observer.next(delta);

      // ESTE metodo es nativo de pixi, y es ejecutado cada frame.
      this.app.ticker.add(listener);

      // NOTE: Teardown logic
      return () => {
        this.app.ticker.remove(listener);
      };
    }).pipe(takeUntil(this.destroy$));

    this.frameUpdate$.subscribe(() => this.checkCollisions());

    this.pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');
    this.backgroundUpdate$ = interval(1000);

    // "Easter egg". Si se presiona 6 veces cualquier tecla en 1 segundo, se muestra un mensaje

    this.pressedKey$
      .pipe(
        bufferTime(1000),
        filter(({ length }) => length > 6),
        tap(() => {
          this.gui.messages.innerHTML += 'WOW, SO MUCH POWER<br>';
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private setBackground() {
    const bg = PIXI.Sprite.from(SPRITE_URLS.IMAGE_BACKGROUND);

    bg.anchor.set(0);
    bg.x = 0;
    bg.y = 0;

    this.app.stage.addChild(bg);
  }

  private setPlayer() {
    this.player = new Player(
      this.app.stage,
      this.frameUpdate$,
      this.pressedKey$.pipe(takeUntil(this.destroy$)),
    );
    console.log(this.player);
  }

  private setSkyline() {
    this.createSkylinePiece(0);
    this.backgroundUpdate$.subscribe(() => this.createSkyline());
  }

  private createSkyline() {
    const { children } = this.skylineContainer;
    const skyline = children[children.length - 1];

    if (skyline.position.x <= CANVAS_SIZE.WIDTH) {
      // TODO: width?
      this.createSkylinePiece(skyline.position.x + skyline.width);
    }
  }

  private createSkylinePiece(positionX: number) {
    new CityBg(this.skylineContainer, this.frameUpdate$, {
      x: positionX,
      y: CANVAS_SIZE.HEIGHT,
    });
  }

  private setObstacles() {
    timer(PHYSICS.PIPE_GENERATION_FIRST_WAIT, PHYSICS.PIPE_GENERATION_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.createPipe();
        this.deleteOldPipes();
        this.updateScore();
      });
  }

  private createPipe() {
    new Pipe(this.app.stage, this.frameUpdate$);
  }

  private deleteOldPipes() {
    this.app.stage.children
      .filter(Boolean)
      .filter(({ type }) => type === 'pipe')
      .filter(({ position }) => position.x < 0)
      .forEach(pipe => this.app.stage.removeChild(pipe));
  }

  private updateScore() {
    this.scoreService.add();
    this.gui.scoreboard.innerHTML = `${this.scoreService.score}`;
  }

  private checkCollisions() {
    const { children } = this.app.stage;

    if (
      children
        .filter(({ type }) => type === 'pipe')
        .some(pipe => this.bump.hit(this.player.sprite, pipe))
    ) {
      this.gameOver();
    }
  }

  private gameOver() {
    this.player.killKiwi();

    this.unsubscribe();
    this.showGameoverInfo();

    this.pressedKey$.pipe(first()).subscribe(() => this.resetGame());
  }

  private showGameoverInfo() {
    const gameOverSprite = PIXI.Sprite.from(SPRITE_URLS.GAME_OVER_TEXT);

    gameOverSprite.anchor.set(0.5);
    gameOverSprite.position.set(CANVAS_SIZE.WIDTH / 2, CANVAS_SIZE.HEIGHT / 3);
    gameOverSprite.scale.set(10);

    this.app.stage.addChild(gameOverSprite);
  }

  private unsubscribe() {
    this.destroy$.next();
  }

  private resetGame() {
    this.scoreService.reset();

    // NOTE: Destroy all
    this.app.destroy(true, { texture: true, children: true, baseTexture: true });

    this.startGame();
  }
}
