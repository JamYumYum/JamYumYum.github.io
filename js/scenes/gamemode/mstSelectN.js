import { primMode } from "../../modus/primMode.js"
import { kruskalMode } from "../../modus/kruskalMode.js"
import { undirectedMode } from "../../modus/undirectedMode.js"
import * as G from '../../graphGenerator.js';
import * as A from '../../algo.js'
const mstSelectN = {
    mode : undefined,
    graph : undefined,
    svg1 : undefined,
    sim1: undefined,
    name1 : "svg1",
    primData : undefined,
    kruskalData : undefined,
    initialEdgeSelection : [],
    totalWeight : undefined,
    
    start : function(){
        //TODO selection for visual help (prim/kruskal/none), setting up interactive force directed graph
        this.graph = G.mstGraph()
        this.mode = primMode
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        document.addEventListener("edgeClicked", this.test)
    },
    test : function(){
        console.log("clicked")
    },
    selectModeUI : function(){
        //TODO draw UI for mode selection(prim/kruskal/none), add eventlisteners
    },
    selectMode : function(){
        //TODO cleanup selectModeUI elements,eventlisteners, set the mode, call start
    },
    generateGame : function(){
        //TODO generate a random graph, initial state, number of next selections 
    },
    
    reset : function(){
        //TODO reset to initial state
        
    },
    undo : function(){
        //TODO undo last move
    },
    exit : function(){
        //TODO cleanup UI, force directed graph, eventlisteners
    }

}

export{mstSelectN}