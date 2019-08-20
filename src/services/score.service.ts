export class ScoreService {
  public score: number = 0;

  constructor() {}

  public add(points: number = 1) {
    this.score += points;
  }
}
