import * as PIXI from 'pixi.js';

import { CANVAS_SIZE, SPRITE_URLS } from '../constants/game-config.constants';

import { Sprite } from 'pixi.js';

export class Player {
  private _sprite: Sprite;
  private ySpeed = 0;
  private flapPosition = SPRITE_URLS.PLAYER.INITIAL;

  constructor() {
    this._sprite = Sprite.from(SPRITE_URLS.PLAYER.INITIAL);
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
    this.sprite.texture = PIXI.Texture.from(this.flapPosition);
    this.flapPosition = this.nextFlapPosition();
  }

  private nextFlapPosition(): string {
    const isFlapping = this.flapPosition === SPRITE_URLS.PLAYER.FLAPPING;
    return isFlapping ? SPRITE_URLS.PLAYER.INITIAL : SPRITE_URLS.PLAYER.FLAPPING;
  }
}
