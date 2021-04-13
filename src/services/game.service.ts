import { Observable } from 'rxjs';

export class GameService {
  /* TODO 1 (hint: use fromEvent) */
  private pressedKey$: Observable<KeyboardEvent>;

  /* TODO 2 (hint: create an Observable from pressedKey$ and use the filter operator) */
  public onFlap$: Observable<KeyboardEvent>;
}
