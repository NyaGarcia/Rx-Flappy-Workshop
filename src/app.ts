import { MainController } from './controllers/main.controller';
import { ScoreService } from './services/score.service';

const view = window.document;
const scoreService = new ScoreService();
const mainController = new MainController(view, scoreService);

mainController.startGame();
