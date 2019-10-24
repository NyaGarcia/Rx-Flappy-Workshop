import { MainController } from './controllers/main.controller';

const view = window.document;
const mainController = new MainController(view);

mainController.startGame();
