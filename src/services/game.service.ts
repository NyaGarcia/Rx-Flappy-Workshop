import { Subject, fromEvent } from 'rxjs';

import { KEYS } from '../constants/game-config.constants';
import { filter } from 'rxjs/operators';

export class GameService {
  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  /* TODO1 (hint: create a Subject that emits numbers) */
  public onFrameUpdate$: Subject<number>;

  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
  );
}
