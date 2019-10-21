import * as PIXI from 'pixi.js';
import { Observable } from 'rxjs';

import { SPRITE_URLS, PHYSICS, CANVAS_SIZE, PARAMS } from '../constants/game_config.constants';

export class Pipe {
  public sprite: PIXI.Sprite;

  private frameUpdateSubscription = this.frameUpdate$.subscribe(delta =>
    this.updatePosition(delta),
  );

  private unsubscribe = () => this.frameUpdateSubscription.unsubscribe();

  constructor(
    public stage: PIXI.Container,
    private frameUpdate$: Observable<number>,
    parent?: PIXI.Sprite,
  ) {
    this.createGameObject(parent);
  }

  private createGameObject(parent?: PIXI.Sprite) {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.PIPE);

    // TODO: improve this
    const anchor = {
      x: 0.5,
      // TODO: -0.5??
      y: parent ? 0.5 : 0.5,
    };

    const pos = {
      x: CANVAS_SIZE.WIDTH + this.sprite.width,
      y: parent ? parent.position.y - PARAMS.VERTICAL_PIPES_SEPARATION : this.getRandomHeight(),
    };

    const scale = {
      x: 7,
      y: parent ? -7 : 7,
    };

    this.sprite.anchor.set(anchor.x, anchor.y);
    this.sprite.position.set(pos.x, pos.y);
    this.sprite.scale.set(scale.x, scale.y);

    this.sprite.type = 'pipe';

    this.stage.addChild(this.sprite);

    this.sprite.once('removed', this.unsubscribe);

    if (!parent) {
      new Pipe(this.stage, this.frameUpdate$, this.sprite);
    }
  }

  private updatePosition(delta: number) {
    this.sprite.position.x -= PHYSICS.PIPE_SPEED * delta;
  }

  private getRandomHeight() {
    return Math.floor(Math.random() * 500) + 500;
  }
}
