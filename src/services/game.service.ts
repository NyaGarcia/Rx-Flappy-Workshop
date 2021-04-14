import { Observable, Subject, fromEvent, interval } from 'rxjs';

import { KEYS } from '../constants/game-config.constants';
import { filter } from 'rxjs/operators';

export class GameService {
  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  public onFrameUpdate$ = new Subject<number>();

  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
  );

  // TODO 1 Solution
  public skylineUpdate$ = interval(1000);
}
