import { mainMenu } from './scenes/mainMenu.js';
import { sceneManager } from './scenes/sceneManager.js';

function main(){
    sceneManager.enterQueue(mainMenu)
    sceneManager.nextScene()
}

window.onload = main;
