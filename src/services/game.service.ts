import { KEYS, PHYSICS } from '../constants/game-config.constants';
import { Subject, fromEvent, interval, timer } from 'rxjs';

import { filter } from 'rxjs/operators';

export class GameService {
  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  public onFrameUpdate$ = new Subject<number>();

  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
  );

  public skylineUpdate$ = interval(1000);

  // TODO 1 Solution
  public createObstacle$ = timer(
    PHYSICS.PIPE_GENERATION_FIRST_WAIT,
    PHYSICS.PIPE_GENERATION_INTERVAL,
  );
}
