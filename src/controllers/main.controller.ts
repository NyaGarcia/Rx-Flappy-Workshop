import * as PIXI from 'pixi.js';

import { CANVAS_SIZE, PHYSICS, SPRITE_URLS } from '../constants/game-config.constants';
import { delay, tap } from 'rxjs/operators';

import { GameService } from '../services/game.service';
import { Player } from '../models/player.model';

export class MainController {
  private app: PIXI.Application;
  private skylineContainer: PIXI.Container;
  private player: Player;

  constructor(private view: Document, private gameService: GameService) {}

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

    // Ticker is used to game-loop
    this.app.ticker.add((delta: number) => {
      // TODO2 (hint: Pass the delta value to onFrameUpdate$)
    });
  }

  private init() {
    this.setBackground();
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

    /* TODO3 (hint: subscribe to onFrameUpdate to player's setGravity) */
    this.gameService.onFrameUpdate$;

    this.gameService.onFlap$
      .pipe(
        tap(() => this.player.flap()),
        delay(PHYSICS.FLAP_DELAY),
        tap(() => this.player.flap()),
      )
      .subscribe();
  }
}
