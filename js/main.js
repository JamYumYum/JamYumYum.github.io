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

let graph;



function main(){
    //graph = G.exgraph();
    graph = G.mstGraph();
    //initializeGraph();
    let graph2 = G.mstGraph();
    console.log(Algo.prim(graph, 0));
    console.log(Algo.kruskal(graph));
    console.log(Algo.dijkstra(graph,0));

    //initiateSimulation("svg1", svg1,sim1);
    //graph = G.mstGraph();
    //initiateSimulation("svg2", svg2,sim2);
    //clearSimulation();
    //directedGraphMode();
    Algo.initValue(graph, 0)
    Algo.initValue(graph2, 0)
    //updateEllipse()
    //updatePolygon()
    /*
    let simOnline = new Promise(resolve=>{
      initiateSimulation("svg1", svg1,sim1);
      updateLine()
      updateEllipse()
      updatePolygon()
      setTimeout(resolve, 0)
    }).then((v)=>{
      
      updateText()
    })
    MainUI.test()
    */
    //interactiveGraph.setMode(directedMode)
    //interactiveGraph.setMode(undirectedMode)
    //interactiveGraph.setMode(kruskalMode)
    //interactiveGraph.setMode(primMode)
    //interactiveGraph.setGraph(graph)
    //testMode.setGraph(graph2)
    //interactiveGraph.initiateSimulation("svg1", svg1,sim1)
    //testMode.initiateSimulation("svg2",svg2,sim2)
    //setTimeout(()=>{interactiveGraph.denyInput()}, 3000)
    //setTimeout(()=>{interactiveGraph.reset()}, 6000)
    //setTimeout(()=>{testMode.reset()}, 6000)
    //let interactiveG = new InteractiveGraph(kruskalMode,graph,"svg1")
    //interactiveG.initiateSimulation()
    mstSelectN.start()
    //vsDijkstra.start()
}

window.onload = main;
