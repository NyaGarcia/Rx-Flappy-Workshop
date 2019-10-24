import * as PIXI from 'pixi.js';

import { CANVAS_SIZE, SPRITE_URLS } from '../constants/game_config.constants';
import { delay, filter, tap } from 'rxjs/operators';

import { Observable } from 'rxjs';

export class Player {
  public sprite: any;

  constructor(public stage: PIXI.Container, private flap$: Observable<KeyboardEvent>) {
    this.createGameObject();
    this.suscribeObservables();
  }

  public killKiwi() {
    this.sprite.rotation = 180;
  }

  private createGameObject() {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.PLAYER.INITIAL);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(250, CANVAS_SIZE.HEIGHT / 2);
    this.sprite.scale.set(5);

    this.stage.addChild(this.sprite);
  }

  private suscribeObservables() {
    this.flap$
      .pipe(
        filter(({ keyCode }) => keyCode === 32 || keyCode === 38),
        tap(() => this.flap()),
        delay(150),
        tap(() => this.changeAnimation(SPRITE_URLS.PLAYER.INITIAL)),
      )
      .subscribe();
  }

  private flap() {
    this.changeAnimation(SPRITE_URLS.PLAYER.FLAPPING);
  }

  private changeAnimation(url: string) {
    const texture = PIXI.Texture.from(url);
    this.sprite.texture = texture;
  }
}
