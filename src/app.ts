import { MainController } from "./controllers/main.controller";
import { ScoreService } from "./services/score.service";

const view = window.document;
const _scoreService = new ScoreService();
const mainController = new MainController(view, _scoreService);
