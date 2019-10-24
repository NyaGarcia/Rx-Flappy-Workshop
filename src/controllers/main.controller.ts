import * as PIXI from 'pixi.js';

import { CANVAS_SIZE, SPRITE_URLS } from '../constants/game_config.constants';
import { Observable, Subject, fromEvent } from 'rxjs';

import { Player } from '../models/player.model';
import { takeUntil } from 'rxjs/operators';

export class MainController {
  private app: PIXI.Application;
  private skylineContainer: PIXI.Container;

  private player: Player;

  private pressedKey$: Observable<KeyboardEvent>;
  private destroy$ = new Subject<void>();

  constructor(private view: Document) {}

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
    this.setPlayer();
    this.app.stage.setChildIndex(this.skylineContainer, 1);
  }

  private setObservables() {
    this.pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');
  }

  private setBackground() {
    const bg = PIXI.Sprite.from(SPRITE_URLS.IMAGE_BACKGROUND);

    bg.anchor.set(0);
    bg.x = 0;
    bg.y = 0;

    this.app.stage.addChild(bg);
  }

  private setPlayer() {
    this.player = new Player(this.app.stage, this.pressedKey$.pipe(takeUntil(this.destroy$)));
  }
}
