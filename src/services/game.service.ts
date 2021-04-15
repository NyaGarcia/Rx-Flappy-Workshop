import { KEYS, PHYSICS } from '../constants/game-config.constants';
import { Observable, Subject, fromEvent, interval, timer } from 'rxjs';
import { filter, scan, takeUntil, tap } from 'rxjs/operators';

export class GameService {
  // TODO 1 (hint: create Subject)
  private stopGame$ = new Subject<void>();

  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  // TODO 3 (hint: use takeUntil)
  public onFrameUpdate$ = new Subject<number>() as Subject<number>;

  // TODO 3 (hint: use takeUntil)
  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
  );

  // TODO 3 (hint: use takeUntil)
  public skylineUpdate$ = interval(1000);

  // TODO 3 (hint: use takeUntil)
  public createObstacle$ = timer(
    PHYSICS.PIPE_GENERATION_FIRST_WAIT,
    PHYSICS.PIPE_GENERATION_INTERVAL,
  );

  // TODO 3 (hint: use takeUntil)
  public score$ = timer(PHYSICS.SCORE_FIRST_WAIT, PHYSICS.PIPE_GENERATION_INTERVAL).pipe(
    scan(score => score + 1, 0),
  );

  public stopGame() {
    // TODO 2 (hint: make stopGame$ emit)
  }

  // TODO 6 (hint: create an Observable that emits ONLY when space is pressed)
  public restart$: Observable<KeyboardEvent>;
}
