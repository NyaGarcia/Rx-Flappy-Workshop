import * as PIXI from "pixi.js";
import { interval, Observable, timer } from "rxjs";
import { filter } from "rxjs/operators";
import {
  PHYSICS,
  CANVAS_SIZE,
  SPRITE_URLS
} from "../constants/game_config.constants";

export class Player {
  private ySpeed: number;
  public sprite: any;
  private _updateSubscription: any;
  private _flapSuscription: any;
  private _isHitGround$: any;

  constructor(
    public stage: PIXI.Container,
    private frameUpdate$: Observable<any>,
    private flap$: Observable<any>
  ) {
    this._createGameObject();
    this._suscribeObservables();
  }

  private _createGameObject() {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.PLAYER.INITIAL);
    this.ySpeed = 0;
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(250, CANVAS_SIZE.HEIGHT / 2);
    this.sprite.scale.set(5);

    this.sprite.gameOver = this.gameOver;
    this.stage.addChild(this.sprite);
  }

  private _suscribeObservables() {
    this._updateSubscription = this.frameUpdate$.subscribe(delta => {
      this._calculateGravity(delta);
    });

    this._flapSuscription = this.flap$
      .pipe(filter(event => event.keyCode === 32 || event.keyCode === 38))
      .subscribe(event => {
        this._flap();
      });
  }

  private _calculateGravity(delta: number) {
    this.ySpeed += PHYSICS.GRAVITY * delta;
    this.sprite.position.y += this.ySpeed;
  }

  private _flap() {
    this.ySpeed = -PHYSICS.FLAP_POWER;
    this._changeAnimation(SPRITE_URLS.PLAYER.FLAPPING);

    timer(250).subscribe(data => {
      this._changeAnimation(SPRITE_URLS.PLAYER.INITIAL);
    });
  }

  private _changeAnimation(url: string) {
    const texture = PIXI.Texture.from(url);
    this.sprite.texture = texture;
  }

  public gameOver = () => {
    this._unsubscribe();
    this._killKiwi();
  };

  private _unsubscribe() {
    this._updateSubscription.unsubscribe();
    this._flapSuscription.unsubscribe();
  }

  private _killKiwi() {
    this.sprite.rotation = 180;
  }
}
