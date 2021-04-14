import { KEYS, PHYSICS } from '../constants/game-config.constants';
import { Observable, Subject, fromEvent, interval, timer } from 'rxjs';

import { filter } from 'rxjs/operators';

export class GameService {
  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  public onFrameUpdate$ = new Subject<number>();

  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
  );

  public skylineUpdate$ = interval(1000);

  public createObstacle$ = timer(
    PHYSICS.PIPE_GENERATION_FIRST_WAIT,
    PHYSICS.PIPE_GENERATION_INTERVAL,
  );

  // TODO 1 (hint: use scan + timer to accumulate the score)
  public score$: Observable<number>;
}
