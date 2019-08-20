import * as PIXI from "pixi.js";
import { Observable, pipe } from "rxjs";
import { map } from "rxjs/operators";
import {
  SPRITE_URLS,
  PHYSICS,
  CANVAS_SIZE
} from "../constants/game_config.constants";

export class CityBg {
  private sprite: any;
  private type: string;
  private _updateSubscription: any;

  constructor(
    public stage: PIXI.Container,
    private update$: Observable<any>,
    private position: { x: number; y: number }
  ) {
    this._createGameObject(this.position);
    this._suscribeObservables();
  }

  private _createGameObject(position: { x: number; y: number }) {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.SKYLINE);
    this.sprite.anchor.set(0, 1);
    this.sprite.position.set(position.x, position.y);
    this.sprite.scale.set(5);
    this.sprite.type = "skyline";
    this.sprite.gameOver = this.gameOver;

    this.stage.addChild(this.sprite);
  }

  private _suscribeObservables() {
    this._updateSubscription = this.update$.subscribe(delta => {
      this._updatePosition(delta);
    });
  }

  public gameOver = () => {
    this._unsubscribe();
  };

  private _unsubscribe() {
    this._updateSubscription.unsubscribe();
  }

  private _updatePosition(delta: number) {
    this.sprite.position.x -= PHYSICS.SKYLINE_SPEED * delta;
  }
}
