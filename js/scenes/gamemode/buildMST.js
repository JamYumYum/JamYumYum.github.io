import { primMode } from "../../modus/primMode.js"
import { kruskalMode } from "../../modus/kruskalMode.js"
import { undirectedMode } from "../../modus/undirectedMode.js"
import { sceneManager } from "../sceneManager.js";
import * as G from '../../tools/graphGenerator.js';
import * as A from '../../tools/algo.js'
import { mainMenu } from "../mainMenu.js";
import { svg0UI } from "../../UI/svg0.js";

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
    //UI content
    infoTextContent : undefined,
    inspectorContent : undefined,
    stateContent : undefined,
    start : function(){
        this.mode = undirectedMode
        svg0UI.drawUI(this.mode)
        this.graph = G.mstGraph()
        this.primData = A.prim(this.graph, 0)
        this.kruskalData = A.kruskal(this.graph)
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        console.log(this.primData)
        this.generateGame()
        console.log(d3.select("svg"))
        console.log(document.getElementById("svg0"))
        document.addEventListener("legalMove", buildMST.ncheckState)
        document.addEventListener("keydown", buildMST.nlogKey)
        document.addEventListener("illegalMove", buildMST.nIllegalMessage)
        document.addEventListener("doNothing", buildMST.nDoNothing)
        document.addEventListener("nodeClicked", buildMST.nNodeClicked)
        window.addEventListener("resize", this.nrecenter)

        d3.select("#infoText").html("Click on Edges in order to add them to your tree. Try to build a MST!")
    },
    nlogKey : function(e){
        buildMST.logKey(e)
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
                d3.select("#infoText").html("Created new Graph!")
                break
            case "Digit1":
                this.selectMode(primMode)
                d3.select("#infoText").html("Showing Prims Safe Edges support. Select a starting vertex!")
                break
            case "Digit2":
                this.selectMode(kruskalMode)
                d3.select("#infoText").html("Showing Kruskals Color support.")
                break
            case "Digit3":
                this.selectMode(undirectedMode)
                d3.select("#infoText").html("No support enabled.")
                break
            case "Escape":
                sceneManager.enterQueue(mainMenu)
                sceneManager.nextScene()
                break
        }
    },
    restart : function(){
        this.cleanup()
        this.graph = G.mstGraph()
        this.primData = A.prim(this.graph, 0)
        this.kruskalData = A.kruskal(this.graph)
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        this.generateGame()
    },
    selectMode : function(mode){
        this.mode = mode
        this.restart()
    },
    generateGame : function(){
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
        this.updateTotal()
        this.updateCommand()
    },
    reset(){
        this.mode.freeze = false
        this.mode.reset()
        this.edgeSelection = []
        this.totalWeight = 0
        if(this.mode.ID == "prim"){
            d3.select("#infoText").html("Select a starting vertex!")
        }
        else{
            d3.select("#infoText").html("Initial state.")
        }
        this.updateTotal()
    },
    undo(){
        this.mode.freeze = false
        if(this.edgeSelection.length != 0){
            this.mode.undo()
            let e = this.edgeSelection.pop()
            this.totalWeight -= e.key
            d3.select("#infoText").html("Undo 1 move.")
        }
        else{
            d3.select("#infoText").html("Initial state.")
            this.reset()
        }
        this.updateTotal()
    },
    win : function(){
        console.log("win")
        d3.select("#infoText").html('You did it! The minimum weight is indeed <SPAN STYLE="font-weight:bold">'
        +this.minWeight+'</SPAN>.')
    },
    lose : function(){
        d3.select("#infoText").html("Try again! Your tree is too heavy!")
    },
    ncheckState : function(){
        buildMST.checkState()
    },
    checkState : function(){
        // on click on a safe edge 
        if(this.freeze){
            return
        }
        this.legalMessage()
        this.edgeSelection.push(this.mode.selection[this.mode.selection.length-1])
        this.totalWeight += this.edgeSelection[this.edgeSelection.length-1].key
        if(this.edgeSelection.length === this.totalMoves){
            this.mode.freeze = true
            if(this.totalWeight > this.minWeight){
                this.lose()
            }
            else{
                this.win()
            }
        }
        this.updateTotal()
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()
    },
    nrecenter : function(){
        buildMST.mode.recenter()
    },
    exit : function(){
        //cleanup UI, force directed graph, eventlisteners
        this.cleanup()
        svg0UI.cleanupUI()
        document.removeEventListener("legalMove", buildMST.ncheckState)
        document.removeEventListener("keydown", buildMST.nlogKey)
        document.removeEventListener("illegalMove", buildMST.nIllegalMessage)
        document.removeEventListener("doNothing", buildMST.nDoNothing)
        document.removeEventListener("nodeClicked", buildMST.nNodeClicked)
        window.removeEventListener("resize", this.nrecenter)
    },
    //messages
    legalMessage : function(){
        let source = buildMST.mode.nameMap.nameMap[buildMST.mode.currentEdge.source.index]
        let target = buildMST.mode.nameMap.nameMap[buildMST.mode.currentEdge.target.index]
        d3.select("#infoText").html(`<SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${source}${target}
        </SPAN> added to the forest.`)
    },
    nDoNothing : function(){
        let source = buildMST.mode.nameMap.nameMap[buildMST.mode.currentEdge.source.index]
        let target = buildMST.mode.nameMap.nameMap[buildMST.mode.currentEdge.target.index]
        d3.select("#infoText").html(`We don't know, if 
        <SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${source}${target}
        </SPAN> is a safe edge!`)
    },
    nIllegalMessage : function(){
        let source = buildMST.mode.nameMap.nameMap[buildMST.mode.currentEdge.source.index]
        let target = buildMST.mode.nameMap.nameMap[buildMST.mode.currentEdge.target.index]
        d3.select("#infoText").html(`Selecting <SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${source}${target}
        </SPAN> would create a cycle!`)
    },
    nNodeClicked : function(){
        let startVertex = primMode.nameMap.nameMap[primMode.startVertex]
        d3.select("#infoText").html(`Starting at <SPAN STYLE="font-weight:bold">
        ${startVertex}
        </SPAN>!`)
    },
    //total update
    updateTotal : function(){
        d3.select("#total").html(`Total weight<br>${this.totalWeight}`)
    },
    //command display
    updateCommand : function(){
        let content = "[E] Undo" + "<br>"
        + "[R] Reset" + "<br>"
        + "[Q] New Graph" + "<br>"
        + "[1] Display prim's safe edge support" + "<br>"
        + "[2] Display kruskal's union-find support" + "<br>"
        + "[3] Basic Graph" + "<br>"
        + "[Esc] Return to Main Menu"
        d3.select("#command").html(content)
    }

}

export {buildMST}