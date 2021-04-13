import * as PIXI from 'pixi.js';

import { CANVAS_SIZE, SPRITE_URLS } from '../constants/game-config.constants';

import { Sprite } from 'pixi.js';

export class Player {
  private _sprite: Sprite;
  private ySpeed = 0;

  constructor() {
    this._sprite = Sprite.from(SPRITE_URLS.PLAYER.INITIAL);
    this.ySpeed = 0;
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(250, CANVAS_SIZE.HEIGHT / 2);
    this.sprite.scale.set(5);
  }

  public get sprite() {
    return this._sprite;
  }

  public killKiwi() {
    this.sprite.rotation = 180;
  }

  public flap() {
    this.changeAnimation(SPRITE_URLS.PLAYER.FLAPPING);
  }

  public changeAnimation(url: string) {
    const texture = PIXI.Texture.from(url);
    this.sprite.texture = texture;
  }
}
