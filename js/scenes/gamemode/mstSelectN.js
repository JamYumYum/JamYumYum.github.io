import { primMode } from "../../modus/primMode.js"
import { kruskalMode } from "../../modus/kruskalMode.js"
import { undirectedMode } from "../../modus/undirectedMode.js"
import * as G from '../../graphGenerator.js';
import * as A from '../../algo.js'
import { sceneManager } from "../sceneManager.js";
import { mainMenu } from "../mainMenu.js";
import { svg0UI } from "../../UI/svg0.js";
const mstSelectN = {
    mode : undefined,
    graph : undefined,
    svg1 : undefined,
    sim1: undefined,
    name1 : "svg0",
    primData : undefined,
    kruskalData : undefined,
    data : undefined,
    initialEdgeSelection : [],
    totalWeight : undefined,
    edgeSelection : [],
    totalMoves : undefined,
    movesRating : [],
    freeze : false,
    //UI elements
    body : document.body,
    
    
    start : function(){
        //TODO selection for visual help (prim/kruskal/none), setting up interactive force directed graph
        this.mode = primMode
        svg0UI.drawUI(this.mode)
        this.graph = G.mstGraph() // set graph TODO? change to better graph
        this.primData = A.prim(this.graph, 0)
        this.kruskalData = A.kruskal(this.graph)
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        primMode.nodeClick(this.graph.vertices[0])
        
        this.generateGame()
        // TODO move eventlistener to selectMode
        document.addEventListener("legalMove", mstSelectN.ncheckState)
        document.addEventListener("keydown", mstSelectN.nlogKey)
        document.addEventListener("illegalMove", mstSelectN.nIllegalMessage)
        document.addEventListener("doNothing", mstSelectN.nDoNothing)
        window.addEventListener("resize", this.nrecenter)

        d3.select("#infoText").html(`Prim's algorithm has done some work. Which are the next 
        <SPAN STYLE="font-weight:bold">
        ${this.totalMoves} </SPAN>edges Prim's algorithm would add to the tree?`)
    },
    nlogKey : function(e){
        mstSelectN.logKey(e)
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
                d3.select("#infoText").html("Created new Graph! "+` Now add the next ${this.totalMoves} edges to the tree!`)
                break
            case "Digit1":
                this.selectMode(primMode)
                d3.select("#infoText").html(`Prim's algorithm has done some work. Which are the next 
                <SPAN STYLE="font-weight:bold">
                ${this.totalMoves} </SPAN>edges Prim's algorithm would add to the tree?`)
                break
            case "Digit2":
                this.selectMode(kruskalMode)
                d3.select("#infoText").html(`Kruskal's algorithm has done some work. Which are the next 
                <SPAN STYLE="font-weight:bold">
                ${this.totalMoves} </SPAN>edges Kruskal's algorithm would add to the tree?`)
                break
            case "Escape":
                sceneManager.enterQueue(mainMenu)
                sceneManager.nextScene()
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
        primMode.nodeClick(this.graph.vertices[0])
        this.generateGame()
    },
    test : function(){
        console.log("clicked")
    },
    drawUI : function(){
        //TODO draw UI, link values(movesleft), add information log
        
    },
    selectModeUI : function(){
        //TODO draw UI for mode selection(prim/kruskal/none), add eventlisteners
    },
    selectMode : function(mode){
        //TODO cleanup selectModeUI elements,eventlisteners, set the mode, call start
        this.mode = mode
        this.restart()
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
        }
        indexSelected = Math.floor(Math.random()* (this.data.mstStep[this.data.mstStep.length-1].length - this.totalMoves))
        for(let i = 0; i< indexSelected+1;i++){
            this.initialEdgeSelection.push(this.data.mstStep[this.data.mstStep.length-1][i])
        }
        this.edgeSelection = this.initialEdgeSelection.slice()
        for(let i = 0; i < this.edgeSelection.length; i++){
            this.mode.lineClick(this.edgeSelection[i],this.name1)
        }
        this.updateTotal()
        this.updateSelection()
        this.updateCommand()
        this.freeze = false
    },
    
    reset : function(){
        //TODO reset to initial state
        let currentLength = this.edgeSelection.length
        for(let i =0; i < (currentLength-this.initialEdgeSelection.length);i++){
            this.undo()
        }
        d3.select("#infoText").html("Initial state.")
        this.updateTotal()
        this.updateSelection()
        this.mode.freeze = false
    },
    undo : function(){
        //TODO undo last move
        if((this.edgeSelection.length - this.initialEdgeSelection.length) > 0){
            this.mode.undo()
            this.edgeSelection.pop()
            this.movesRating.pop()
            d3.select("#infoText").html("Undo 1 move.")
        }
        else{
            d3.select("#infoText").html("Initial state.")
        }
        this.updateTotal()
        this.updateSelection()
        this.mode.freeze = false
    },
    win : function(){
        //TODO
        console.log("win")
        if(this.mode.ID == "prim"){
            d3.select("#infoText").html("Good job! You did it just like Prim's algorithm!")
        }
        else{
            d3.select("#infoText").html("Good job! you did it just like Kruskal's algorithm!")
        }
    },
    lose : function(){
        //TODO
        console.log("lose")
        if(this.mode.ID == "prim"){
            d3.select("#infoText").html("Try again! Prim's algorithm wouldn't do that!")
        }
        else{
            d3.select("#infoText").html("Try again! Kruskal's algorithm wouldn't do that!")
        }
    },
    ncheckState : function(){
        mstSelectN.checkState()
    },
    checkState : function(){
        // on click on a safe edge 
        if(this.freeze){
            return
        }
        this.legalMessage()
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
            this.mode.freeze = true
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
        this.updateTotal()
        this.updateSelection()
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()
    },
    nrecenter : function(){
        mstSelectN.mode.recenter()
    },
    exit : function(){
        //TODO cleanup UI, force directed graph, eventlisteners
        this.cleanup()
        svg0UI.cleanupUI()
        primMode.reset()
        document.removeEventListener("legalMove", mstSelectN.ncheckState)
        document.removeEventListener("keydown", mstSelectN.nlogKey)
        document.removeEventListener("illegalMove", mstSelectN.nIllegalMessage)
        document.removeEventListener("doNothing", mstSelectN.nDoNothing)
        window.removeEventListener("resize", this.nrecenter)
    },
    //messages
    legalMessage : function(){
        let source = mstSelectN.mode.nameMap.nameMap[mstSelectN.mode.currentEdge.source.index]
        let target = mstSelectN.mode.nameMap.nameMap[mstSelectN.mode.currentEdge.target.index]
        d3.select("#infoText").html(`<SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${source}${target}
        </SPAN> added to your tree.`)
    },
    nDoNothing : function(){
        let source = mstSelectN.mode.nameMap.nameMap[mstSelectN.mode.currentEdge.source.index]
        let target = mstSelectN.mode.nameMap.nameMap[mstSelectN.mode.currentEdge.target.index]
        d3.select("#infoText").html(`We don't know, if 
        <SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${source}${target}
        </SPAN> is a safe edge!`)
    },
    nIllegalMessage : function(){
        let source = mstSelectN.mode.nameMap.nameMap[mstSelectN.mode.currentEdge.source.index]
        let target = mstSelectN.mode.nameMap.nameMap[mstSelectN.mode.currentEdge.target.index]
        d3.select("#infoText").html(`Selecting <SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${source}${target}
        </SPAN> would create a cycle!`)
    },
    //total update
    updateTotal : function(){
        d3.select("#total").html(`Moves left<br>${this.totalMoves-this.movesRating.length}`)
    },
    //selection update
    updateSelection : function(){
        let content = "Selection<br>Recent "
        for(let i = this.edgeSelection.length; i>0 ; i--){
            let source = mstSelectN.mode.nameMap.nameMap[this.edgeSelection[i-1].source.index]
            let target = mstSelectN.mode.nameMap.nameMap[this.edgeSelection[i-1].target.index]
            content = content+ `[${i}]<SPAN STYLE="text-decoration:overline; font-weight:bold">
            ${source}${target}
            </SPAN> w: ${this.edgeSelection[i-1].key}<br><br>`
        }
        d3.select("#selection").html(content)
    },
    //command display
    updateCommand : function(){
        let content = "Commands Keybind<br>"
        + "[E] Undo" + "<br>"
        + "[R] Reset" + "<br>"
        + "[Q] New Graph" + "<br>"
        + "[1] Switch to prim" + "<br>"
        + "[2] Switch to kruskal" + "<br>"
        + "[Esc] Return to Main Menu"
        d3.select("#command").html(content)
    }


}

export{mstSelectN}