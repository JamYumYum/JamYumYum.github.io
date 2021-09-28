import { primMode } from "../../modus/primMode.js"
import { kruskalMode } from "../../modus/kruskalMode.js"
import { undirectedMode } from "../../modus/undirectedMode.js"
import * as G from '../../graphGenerator.js';
import * as A from '../../algo.js'

const buildMST = {
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
        //TODO selection for visual help (prim/kruskal/none), setting up interactive force directed graph
        this.graph = G.mstGraph() // set graph TODO? change to better graph
        this.primData = A.prim(this.graph, 0)
        this.kruskalData = A.kruskal(this.graph)
        this.mode = undirectedMode
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        
        this.generateGame()
        // TODO move eventlistener to selectMode
        document.addEventListener("legalMove", ()=> buildMST.checkState())
        document.addEventListener("keydown", buildMST.logKey.bind(this))
    },
    logKey : function(e){
        console.log(e)
        switch(e.code){
            case "KeyR":
                this.reset()
                break
            case "KeyE":
                this.undo()
                break
            case "KeyQ":
                this.restart()
                break
            case "Digit1":
                this.selectMode(primMode)
                break
            case "Digit2":
                this.selectMode(kruskalMode)
                break
            case "Digit3":
                this.selectMode(undirectedMode)
                break
        }
    },
    restart : function(){
        //TODO
        this.cleanup()
        this.graph = G.mstGraph() // set graph TODO? change to better graph
        this.primData = A.prim(this.graph, 0)
        this.kruskalData = A.kruskal(this.graph)
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        this.generateGame()
    },
    selectMode : function(mode){
        //TODO cleanup selectModeUI elements,eventlisteners, set the mode, call start
        this.mode = mode
        this.restart()
    },
    generateGame : function(){
        //TODO
        this.freeze = true
        switch(this.mode.ID){
            case "prim":
                this.data = this.primData
                break
            case "kruskal":
                this.data = this.kruskalData
                break
            case "undirected":
                if(Math.floor(Math.random()*2) == 0){
                    this.data = this.primData
                }
                else{
                    this.data = this.kruskalData
                }
                break
        }
        this.edgeSelection = []
        this.totalMoves = this.graph.vertices.length - 1
        this.totalWeight = 0
        this.minWeight = 0
        for(let i=0; i<this.data.mstStep[this.data.mstStep.length-1].length; i++ ){
            this.minWeight += this.data.mstStep[this.data.mstStep.length-1][i].key
        }
        this.freeze = false
    },
    reset(){
        this.mode.reset()
        this.edgeSelection = []
        this.totalWeight = 0
    },
    undo(){
        if(this.edgeSelection.length != 0){
            this.mode.undo()
            let e = this.edgeSelection.pop()
            this.totalWeight -= e.key
        }
    },
    win : function(){
        //TODO
        console.log("win")
    },
    lose : function(){
        //TODO
        console.log("lose")
    },
    checkState : function(){
        //TODO
        // on click on a safe edge 
        if(this.freeze){
            return
        }
        this.edgeSelection.push(this.mode.selection[this.mode.selection.length-1])
        this.totalWeight += this.edgeSelection[this.edgeSelection.length-1].key
        if(this.edgeSelection.length === this.totalMoves){
            if(this.totalWeight > this.minWeight){
                this.lose()
            }
            else{
                this.win()
            }
        }
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()
    },
    exit : function(){
        //TODO cleanup UI, force directed graph, eventlisteners
        this.cleanup()
    }
}

export {buildMST}