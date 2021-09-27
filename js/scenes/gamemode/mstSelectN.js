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
    data : undefined,
    initialEdgeSelection : [],
    totalWeight : undefined,
    edgeSelection : [],
    totalMoves : undefined,
    movesRating : [],
    freeze : false,
    
    start : function(){
        //TODO selection for visual help (prim/kruskal/none), setting up interactive force directed graph
        this.graph = G.mstGraph() // set graph TODO? change to better graph
        this.primData = A.prim(this.graph, 0)
        this.kruskalData = A.kruskal(this.graph)
        this.mode = kruskalMode
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        
        this.generateGame()
        // TODO move eventlistener to selectMode
        document.addEventListener("edgeClicked", this.test)
        document.addEventListener("legalMove", ()=> mstSelectN.checkState())
        document.addEventListener("keydown", mstSelectN.logKey.bind(this))
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
        }
    },
    restart : function(){
        //TODO
        primMode.cleanup()
        kruskalMode.cleanup()
        this.graph = G.mstGraph() // set graph TODO? change to better graph
        this.primData = A.prim(this.graph, 0)
        this.kruskalData = A.kruskal(this.graph)
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        this.generateGame()
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
        this.freeze = true
        this.totalMoves = Math.floor(3 + Math.random()* 3)
        let indexSelected = 0
        this.edgeSelection = []
        this.initialEdgeSelection = []
        this.movesRating = []
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
        indexSelected = Math.floor(Math.random()* (this.data.mstStep[this.data.mstStep.length-1].length - this.totalMoves))
        for(let i = 0; i< indexSelected+1;i++){
            this.initialEdgeSelection.push(this.data.mstStep[this.data.mstStep.length-1][i])
        }
        this.edgeSelection = this.initialEdgeSelection.slice()
        for(let i = 0; i < this.edgeSelection.length; i++){
            this.mode.lineClick(this.edgeSelection[i],this.name1)
        }
        this.freeze = false
    },
    
    reset : function(){
        //TODO reset to initial state
        let currentLength = this.edgeSelection.length
        for(let i =0; i < (currentLength-this.initialEdgeSelection.length);i++){
            this.undo()
        }
    },
    undo : function(){
        //TODO undo last move
        if((this.edgeSelection.length - this.initialEdgeSelection.length) > 0){
            this.mode.undo()
            this.edgeSelection.pop()
            this.movesRating.pop()
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
        // on click on a safe edge 
        if(this.freeze){
            return
        }
        this.edgeSelection.push(this.mode.selection[this.mode.selection.length-1])
        if(this.mode.goodMove()){
            this.movesRating.push(true)
            console.log("good move")
        }
        else{
            this.movesRating.push(false)
            console.log("bad move")
        }
        // no more moves left => check for win
        if(this.movesRating.length === this.totalMoves){
            let win = true
            for(let i = 0; i< this.movesRating.length; i++){
                if(!this.movesRating[i]){
                    win = false
                }
            }
            if(win){
                this.win()
            }
            else{
                this.lose()
            }
        }
    },
    exit : function(){
        //TODO cleanup UI, force directed graph, eventlisteners
    }

}

export{mstSelectN}