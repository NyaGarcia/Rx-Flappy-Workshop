import { Observable, Subject, fromEvent, interval, timer } from 'rxjs';

import { KEYS } from '../constants/game-config.constants';
import { filter } from 'rxjs/operators';

export class GameService {
  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  public onFrameUpdate$ = new Subject<number>();

  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
  );

  public skylineUpdate$ = interval(1000);

  /* TODO 1 (hint: create an observable that waits PHYSICS.PIPE_GENERATION_FIRST_WAIT seconds,
     then starts emitting values every PHYSICS.PIPE_GENERATION_INTERVAL seconds) */
  public createObstacle$: Observable<number>;
}
