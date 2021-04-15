import { KEYS, PHYSICS } from '../constants/game-config.constants';
import { Observable, Subject, fromEvent, interval, timer } from 'rxjs';
import { filter, scan, takeUntil } from 'rxjs/operators';

export class GameService {
  private stopGame$ = new Subject<void>();

  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  public onFrameUpdate$ = new Subject<number>().pipe(takeUntil(this.stopGame$)) as Subject<number>;

  public onFlap$ = this.pressedKey$.pipe(
    filter(({ code }) => code === KEYS.SPACE || code === KEYS.UP),
    takeUntil(this.stopGame$),
  );

  public skylineUpdate$ = interval(1000).pipe(takeUntil(this.stopGame$));

  public createObstacle$ = timer(
    PHYSICS.PIPE_GENERATION_FIRST_WAIT,
    PHYSICS.PIPE_GENERATION_INTERVAL,
  ).pipe(takeUntil(this.stopGame$));

  public score$ = timer(PHYSICS.SCORE_FIRST_WAIT, PHYSICS.PIPE_GENERATION_INTERVAL).pipe(
    scan(score => score + 1, 0),
    takeUntil(this.stopGame$),
  );

  public stopGame() {
    this.stopGame$.next();
  }

  public restart$ = this.pressedKey$.pipe(filter(({ code }) => code === KEYS.SPACE));

  // TODO 1 (hint: create an Observable that emits if keys are pressed more than 6 times in 1s)
  public easterEgg$: Observable<KeyboardEvent[]>;
}
