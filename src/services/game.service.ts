import { Observable, Subject, fromEvent } from 'rxjs';

import { KEYS } from '../constants/game-config.constants';
import { filter } from 'rxjs/operators';

export class GameService {
  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  public onFrameUpdate$ = new Subject<number>();

  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
  );

  // TODO 1 (hint: create an Observable that emits every second)
  public skylineUpdate$: Observable<number>;
}
