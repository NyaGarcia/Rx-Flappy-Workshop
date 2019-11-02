import { Observable } from 'rxjs';
import { Skyline } from '../models/skyline.model';

export class SkylineService {
  constructor(private frameUpdate$: Observable<number>, private skylines: PIXI.Container) {}

  public getSkylines() {
    return this.skylines;
  }

  public getLastSkylineObject() {
    const { children } = this.skylines;
    return children[children.length - 1];
  }

  public addSkyline(skyline: Skyline) {
    this.skylines.addChild(skyline.getSprite());
    this.subscribe(skyline);
  }

  public deleteSkyline(skyline: PIXI.DisplayObject) {
    this.skylines.removeChild(skyline);
  }

  private subscribe(skyline: Skyline) {
    this.frameUpdate$.subscribe(delta => skyline.updatePosition(delta));
  }
}
