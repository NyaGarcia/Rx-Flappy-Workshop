import { KEYS, PHYSICS } from '../constants/game-config.constants';
import { Observable, Subject, fromEvent, interval, timer } from 'rxjs';
import { filter, scan, takeUntil } from 'rxjs/operators';

export class GameService {
  // TODO 1 Solution
  private stopGame$ = new Subject<void>();

  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  // TODO 3 Solution
  public onFrameUpdate$ = new Subject<number>().pipe(takeUntil(this.stopGame$)) as Subject<number>;

  // TODO 3 Solution
  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
    takeUntil(this.stopGame$),
  );

  // TODO 3 Solution
  public skylineUpdate$ = interval(1000).pipe(takeUntil(this.stopGame$));

  // TODO 3 Solution
  public createObstacle$ = timer(
    PHYSICS.PIPE_GENERATION_FIRST_WAIT,
    PHYSICS.PIPE_GENERATION_INTERVAL,
  ).pipe(takeUntil(this.stopGame$));

  // TODO 3 Solution
  public score$ = timer(PHYSICS.SCORE_FIRST_WAIT, PHYSICS.PIPE_GENERATION_INTERVAL).pipe(
    scan(score => score + 1, 0),
    takeUntil(this.stopGame$),
  );

  // TODO 2 Solution
  public stopGame() {
    this.stopGame$.next();
  }

  // TODO 7 Solution
  public restart$ = this.pressedKey$.pipe(filter(({ code }) => code === KEYS.SPACE));
}
