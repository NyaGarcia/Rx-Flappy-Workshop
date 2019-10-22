import * as PIXI from 'pixi.js';
import { Observable } from 'rxjs';
import { filter, tap, debounceTime } from 'rxjs/operators';

import { PHYSICS, CANVAS_SIZE, SPRITE_URLS } from '../constants/game_config.constants';

export class Player {
  private ySpeed: number;
  public sprite: any;

  constructor(
    public stage: PIXI.Container,
    private frameUpdate$: Observable<number>,
    private flap$: Observable<KeyboardEvent>,
  ) {
    this.createGameObject();
    this.suscribeObservables();
  }

  public killKiwi() {
    this.sprite.rotation = 180;
  }

  private createGameObject() {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.PLAYER.INITIAL);
    this.ySpeed = 0;
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(250, CANVAS_SIZE.HEIGHT / 2);
    this.sprite.scale.set(5);

    this.stage.addChild(this.sprite);
  }

  private suscribeObservables() {
    this.frameUpdate$.subscribe(delta => this.calculateGravity(delta));

    this.flap$
      .pipe(
        filter(({ keyCode }) => keyCode === 32 || keyCode === 38),
        tap(() => this.flap()),
        debounceTime(250),
        tap(() => this.changeAnimation(SPRITE_URLS.PLAYER.INITIAL)),
      )
      .subscribe();
  }

  private calculateGravity(delta: number) {
    this.ySpeed += PHYSICS.GRAVITY * delta;
    this.sprite.position.y += this.ySpeed;
  }

  private flap() {
    this.ySpeed = -PHYSICS.FLAP_POWER;
    this.changeAnimation(SPRITE_URLS.PLAYER.FLAPPING);
  }

  private changeAnimation(url: string) {
    const texture = PIXI.Texture.from(url);
    this.sprite.texture = texture;
  }
}
