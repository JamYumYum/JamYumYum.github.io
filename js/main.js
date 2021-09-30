//import * as G from './algo.js';
import PQueue from './ds/pQueue.js';
import * as G from './graphGenerator.js';
import * as Algo from './algo.js';
import * as Vector from './2dVector.js'
import * as MainUI from './UI/mainUI.js'
import * as dMode from './modus/directedMode.js'
import {interactiveGraph} from './interactiveGraph.js'
//import InteractiveGraph from './interactiveGraph.js'
import {directedMode} from './modus/directedMode.js'
import {undirectedMode} from './modus/undirectedMode.js'
import {kruskalMode} from './modus/kruskalMode.js'
import {primMode} from './modus/primMode.js'
import {vsDijkstraGraph} from './modus/vsDijkstraGraph.js'
import {mstSelectN} from './scenes/gamemode/mstSelectN.js'
import {vsDijkstra} from './scenes/gamemode/vsDijkstra.js'
import { buildMST } from './scenes/gamemode/buildMST.js';
import { ssspTree } from './scenes/gamemode/ssspTree.js';
import { mainMenu } from './scenes/mainMenu.js';
import { sceneManager } from './scenes/sceneManager.js';

let graph;



function main(){
    //mstSelectN.start()
    //vsDijkstra.start()
    //buildMST.start()
    //ssspTree.start()
    sceneManager.enterQueue(mainMenu)
    sceneManager.nextScene()
}

window.onload = main;
