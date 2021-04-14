import * as PIXI from 'pixi.js';

import { CANVAS_SIZE, PHYSICS, SPRITE_URLS } from '../constants/game-config.constants';
import { delay, tap } from 'rxjs/operators';

import { GameService } from '../services/game.service';
import { Pipe } from '../models/pipe.model';
import { Player } from '../models/player.model';
import { Skyline } from '../models/skyline.model';

interface GUI {
  scoreboard: HTMLElement;
  messages: HTMLElement;
}
export class MainController {
  private app: PIXI.Application;
  private skylineContainer: PIXI.Container;
  private player: Player;
  private gui: GUI;

  constructor(private view: Document, private gameService: GameService) {
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

    this.app.ticker.add((delta: number) => this.gameService.onFrameUpdate$.next(delta));
  }

  private init() {
    this.setBackground();
    this.renderSkyline();
    this.renderObstacles();
    this.updateScore();
    this.createPlayer();
    this.app.stage.setChildIndex(this.skylineContainer, 1);
  }

  private setBackground() {
    const bg = PIXI.Sprite.from(SPRITE_URLS.IMAGE_BACKGROUND);

    bg.anchor.set(0);
    bg.x = 0;
    bg.y = 0;

    this.app.stage.addChild(bg);
  }

  private createPlayer() {
    this.player = new Player();
    this.app.stage.addChild(this.player.sprite);

    this.gameService.onFrameUpdate$.subscribe(delta => this.player.setGravity(delta));

    this.gameService.onFlap$
      .pipe(
        tap(() => this.player.flap()),
        delay(PHYSICS.FLAP_DELAY),
        tap(() => this.player.flap()),
      )
      .subscribe();
  }

  private renderSkyline(): void {
    this.createInitialSkyline();

    this.app.stage.setChildIndex(this.skylineContainer, 1);

    this.gameService.skylineUpdate$.subscribe(_ => this.createSkyline());
  }

  private createInitialSkyline() {
    for (let i = 0; i < 3; i++) {
      this.createSkylinePiece(i * 500);
    }
  }

  private createSkyline(): void {
    const lastSkyline = this.getLastSkyline();

    if (lastSkyline.position.x <= CANVAS_SIZE.WIDTH) {
      this.createSkylinePiece(lastSkyline.position.x + lastSkyline.width);
    }
  }

  private getLastSkyline(): any {
    const { children } = this.skylineContainer;

    return children[children.length - 1];
  }

  private createSkylinePiece(x: number): void {
    const skyline = new Skyline({
      x,
      y: CANVAS_SIZE.HEIGHT,
    });

    this.skylineContainer.addChild(skyline.sprite);

    this.gameService.onFrameUpdate$.subscribe(n => skyline.updatePosition(n));
  }

  private renderObstacles() {
    this.gameService.createObstacle$
      .pipe(
        tap(_ => this.createPipeSet()),
        tap(_ => this.deleteOldPipes()),
      )
      .subscribe();
  }

  private createPipeSet(): void {
    const bottomPipe = new Pipe();
    const topPipe = new Pipe(bottomPipe);

    for (const pipe of [bottomPipe, topPipe]) {
      this.app.stage.addChild(pipe.sprite);

      this.gameService.onFrameUpdate$.subscribe(delta => pipe.updatePosition(delta));
    }
  }

  private deleteOldPipes(): void {
    const children = this.app.stage.children as any[];
    children
      .filter(Boolean)
      .filter(({ type }) => type === 'pipe')
      .filter(({ position }) => position.x < 0)
      .forEach(pipe => this.app.stage.removeChild(pipe));
  }

  private updateScore() {
    // TODO 2 Solution
    this.gameService.score$
      .pipe(tap(score => (this.gui.scoreboard.innerHTML = `${score}`)))
      .subscribe();
  }
}
