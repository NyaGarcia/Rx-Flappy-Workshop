import { Observable } from 'rxjs';

export class PipeService {
  constructor(private frameUpdate$: Observable<number>) {}
}
