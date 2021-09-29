import { primMode } from "../../modus/primMode.js"
import * as G from '../../graphGenerator.js';
import * as A from '../../algo.js'

const primTutorial = {
    mode : undefined,
    graph : undefined,
    svg1 : undefined,
    sim1: undefined,
    name1 : "svg0",
    primData : undefined,
    kruskalData : undefined,
    data : undefined,
    totalWeight : undefined,
    minWeight : undefined,
    edgeSelection : [],
    totalMoves : undefined,
    freeze : false,

    start : function(){
        this.graph = G.mstGraph() // TODO custom graph
        this.primData = A.prim(this.graph, 0)
        this.mode = primMode
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
    },
}

export {primTutorial}