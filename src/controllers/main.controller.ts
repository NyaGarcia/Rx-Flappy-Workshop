import * as PIXI from 'pixi.js';

import { CANVAS_SIZE, SPRITE_URLS } from '../constants/game-config.constants';

import { GameService } from '../services/game.service';
import { Player } from '../models/player.model';

declare var Bump: any;
interface GUI {
  canvasContainer: HTMLElement;
  scoreboard: HTMLElement;
  messages: HTMLElement;
}
export class MainController {
  private gui: GUI;
  private app: PIXI.Application;
  private skylineContainer: PIXI.Container;
  private player: Player;

  constructor(private view: Document, private gameService: GameService) {
    this.gui = {
      canvasContainer: this.view.getElementById('canvasContainer'),
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

    this.gui.canvasContainer.appendChild(this.app.view);

    this.skylineContainer = new PIXI.Container();
    this.app.stage.addChild(this.skylineContainer);
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

    this.gameService.onFlap$
      .pipe
      /* TODO 3 (hint: use tap + delay to change Kiwi's animation) */
      ()
      .subscribe();
  }
}
