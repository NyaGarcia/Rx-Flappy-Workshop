import { KEYS } from '../constants/game-config.constants';
import { filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

export class GameService {
  /* TODO 1: Solution */
  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  /* TODO 2: Solution */
  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
  );
}
