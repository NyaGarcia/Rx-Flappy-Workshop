import { Observable } from 'rxjs';
import { Skyline } from '../models/skyline.model';

export class SkylineService {
  constructor(private frameUpdate$: Observable<number>, private skylines: PIXI.Container) {}

  public getSkylines(): PIXI.Container {
    return this.skylines;
  }

  public getLastSkylineObject(): PIXI.DisplayObject {
    const { children } = this.skylines;
    return children[children.length - 1];
  }

  public addSkyline(skyline: Skyline): void {
    this.skylines.addChild(skyline.getSprite());
    this.subscribe(skyline);
  }

  public deleteSkyline(skyline: PIXI.DisplayObject): void {
    this.skylines.removeChild(skyline);
  }

  private subscribe(skyline: Skyline): void {
    this.frameUpdate$.subscribe(delta => skyline.updatePosition(delta));
  }
}
