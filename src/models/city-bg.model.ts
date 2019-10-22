import * as PIXI from 'pixi.js';
import { Observable } from 'rxjs';

import { SPRITE_URLS, PHYSICS } from '../constants/game_config.constants';

interface Position {
  x: number;
  y: number;
}

export class CityBg {
  private sprite: PIXI.Sprite;

  constructor(
    public stage: PIXI.Container,
    private frameUpdate$: Observable<number>,
    position: Position,
  ) {
    this.createGameObject(position);

    this.frameUpdate$.subscribe(delta => this.updatePosition(delta));
  }

  private createGameObject({ x, y }: Position) {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.SKYLINE);
    this.sprite.anchor.set(0, 1);
    this.sprite.position.set(x, y);
    this.sprite.scale.set(5);

    this.sprite.type = 'skyline';

    this.stage.addChild(this.sprite);
  }

  private updatePosition(delta: number) {
    this.sprite.position.x -= PHYSICS.SKYLINE_SPEED * delta;
  }
}
