import { delay, filter, tap } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { SPRITE_URLS } from '../constants/game_config.constants';

export class PlayerService {
  constructor(
    private frameUpdate$: Observable<number>,
    private pressedKey$: Observable<KeyboardEvent>,
    private player: Player,
  ) {
    this.subscribe();
  }

  private subscribe() {
    this.frameUpdate$.subscribe(delta => {
      this.player.calculateGravity(delta);
    });

    this.pressedKey$
      .pipe(
        filter(({ keyCode }) => keyCode === 32 || keyCode === 38),
        tap(() => this.player.flap()),
        delay(150),
        tap(() => this.player.changeAnimation(SPRITE_URLS.PLAYER.INITIAL)),
      )
      .subscribe();
  }
}
