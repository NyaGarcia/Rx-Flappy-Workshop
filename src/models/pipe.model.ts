import * as PIXI from "pixi.js";
import { Observable, pipe } from "rxjs";
import { map } from "rxjs/operators";
import {
  SPRITE_URLS,
  PHYSICS,
  CANVAS_SIZE,
  PARAMS
} from "../constants/game_config.constants";
export class Pipe {
  public sprite: any;
  private type: string;
  private _updateSubscription: any;

  constructor(
    public stage: PIXI.Container,
    private update$: Observable<any>,
    private parent?: PIXI.Sprite
  ) {
    this._createGameObject(this.parent);
    this._suscribeObservables();
  }

  private _createGameObject(parent: PIXI.Sprite) {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.PIPE);

    //TODO improve this
    const generationConfig = {
      anchor: {
        x: 0.5,
        y: parent ? 0.5 : 0.5
      },
      pos: {
        x: CANVAS_SIZE.WIDTH + this.sprite.width,
        y: parent
          ? parent.position.y - PARAMS.VERTICAL_PIPES_SEPARATION
          : this._getRandomHeight()
      },
      scale: {
        x: 7,
        y: parent ? -7 : 7
      }
    };

    this.sprite.anchor.set(
      generationConfig.anchor.x,
      generationConfig.anchor.y
    );
    this.sprite.position.set(generationConfig.pos.x, generationConfig.pos.y);
    this.sprite.scale.set(generationConfig.scale.x, generationConfig.scale.y);
    this.sprite.type = "pipe";
    this.sprite.gameOver = this.gameOver;

    this.stage.addChild(this.sprite);

    if (!parent) {
      new Pipe(this.stage, this.update$, this.sprite);
    }
  }

  private _suscribeObservables() {
    this._updateSubscription = this.update$.subscribe(delta => {
      this._updatePosition(delta);
    });
  }

  private _updatePosition(delta: number) {
    this.sprite.position.x -= PHYSICS.PIPE_SPEED * delta;
  }

  private _getRandomHeight() {
    return Math.floor(Math.random() * 500) + 500;
  }

  public gameOver = () => {
    this._unsubscribe();
  };

  private _unsubscribe() {
    this._updateSubscription.unsubscribe();
  }
}
