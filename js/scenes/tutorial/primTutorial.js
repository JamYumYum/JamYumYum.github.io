import { primMode } from "../../modus/primMode.js"
import * as G from '../../tools/graphGenerator.js';
import * as A from '../../tools/algo.js'
import { svg0UI } from "../../UI/svg0.js";
import { mainMenu } from "../mainMenu.js";
import { sceneManager } from "../sceneManager.js";

const primTutorial = {
    mode : undefined,
    graph : undefined,
    algoGraph : undefined,
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
    messages : [],
    step : 0,
    extractedEdge: undefined,
    start : function(){
        this.mode = primMode
        svg0UI.drawUI(this.mode)
        this.graph = G.tutorialGraph() 
        this.algoGraph = G.copyGraph(this.graph)
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        this.step = 0
        this.selectedStartVertex = false

        document.addEventListener("legalMove", primTutorial.nAddEdge)
        document.addEventListener("illegalMove", primTutorial.nIgnore)
        document.addEventListener("doNothing", primTutorial.nIgnore2)
        document.addEventListener("nodeClicked", primTutorial.nNodeClicked)
        document.addEventListener("keydown", primTutorial.nlogKey)
        window.addEventListener("resize", this.nrecenter)
        
        this.initMessages()
        d3.select("#infoText").html(this.messages[0])
        this.updateCommand()
        this.updateInfo()
    },
    nlogKey : function(e){
        primTutorial.logKey(e)
    },
    logKey : function(e){
        switch(e.code){
            case "Escape":
                sceneManager.enterQueue(mainMenu)
                sceneManager.nextScene()
                break
        }    
    },
    reset(){
        this.mode.reset()
        this.totalWeight = 0
        this.step = 0
        if(this.mode.ID == "prim"){
            d3.select("#infoText").html("Select a starting vertex!")
        }
        else{
            d3.select("#infoText").html("Initial state.")
        }
        this.updateTotal()
    },
    undo(){
        if(this.edgeSelection.length != 0){
            let e = this.mode.selection[this.mode.selection.length-1]
            this.mode.undo()
            this.totalWeight -= e.key
            this.step -= 1
        }
        else{
            this.reset()
        }
        this.updateTotal()
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()
    },
    nrecenter : function(){
        primTutorial.mode.recenter()
    },
    exit : function(){
        this.cleanup()
        svg0UI.cleanupUI()
        document.removeEventListener("legalMove", primTutorial.nAddEdge)
        document.removeEventListener("illegalMove", primTutorial.nIgnore)
        document.removeEventListener("doNothing", primTutorial.nIgnore2)
        document.removeEventListener("nodeClicked", primTutorial.nNodeClicked)
        document.removeEventListener("keydown", primTutorial.nlogKey)
        window.removeEventListener("resize", this.nrecenter)
    },
    nNodeClicked : function(){
        primTutorial.primData = A.prim(primTutorial.algoGraph, primMode.startVertex)
        console.log(primTutorial.primData)
        d3.select("#infoText").html("Prim will now start the main loop, click on a safe edge!")
    },
    nAddEdge : function(){
        primTutorial.addEdge()
    },
    // actions if edge was clicked
    addEdge : function(){
        let source = primMode.nameMap.nameMap[primMode.currentEdge.source.name]
        let target = primMode.nameMap.nameMap[primMode.currentEdge.target.name]
        let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">${source}${target}</SPAN>`
        if(primMode.goodMove()){
            d3.select("#infoText").html(`${edge} is a safe edge! Select the next safe edge!`)
            this.step += 1
            if(primMode.selection.length == this.graph.vertices.length -1){
                d3.select("#infoText").html(`${edge} is a safe edge! Every vertex is now connected and you have built a MST, Prim is now done! Press [Esc] to return to the main menu.`)

            }
        }
        else{
            d3.select("#infoText").html(`${edge} wouldn't create a cycle, but it is not the edge Prim is looking for!`)
            primMode.undo()
        }
    },
    nIgnore : function(){
        primTutorial.ignore()
    },
    ignore : function(){
        if(primMode.selection.length == this.graph.vertices.length -1) return
        let source = primMode.nameMap.nameMap[primMode.currentEdge.source.name]
        let target = primMode.nameMap.nameMap[primMode.currentEdge.target.name]
        let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">${source}${target}</SPAN>`
        d3.select("#infoText").html(`${edge} is not a safe edge, try another edge!`)
        primMode.ignore[primMode.currentEdge.index] = false
    },
    nIgnore2 : function(){
        primTutorial.ignore2()
    },
    ignore2 : function(){
        let source = primMode.nameMap.nameMap[primMode.currentEdge.source.name]
        let target = primMode.nameMap.nameMap[primMode.currentEdge.target.name]
        let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">${source}${target}</SPAN>`
        d3.select("#infoText").html(`${edge} is undecided, we don't know if it is safe!`)
    },

    //total update
    updateTotal : function(){
        d3.select("#total").html(`Total weight<br>${this.totalWeight}`)
    },

    //messages
    initMessages : function(){
        // starting message, select starting vertex more if necessary
        this.messages[0] = "Prim's algorithm tutorial. Start by Selecting a Vertex. Click on any one."
        
    },
    
    //command display
    updateCommand : function(){
        let content = "[Esc] Return to Main Menu"
        d3.select("#command").html(content)
    },
    //update tutorial info
    updateInfo : function(){
        d3.select("#grid1").append("div").attr("id", "tutorialInfo")
        let content = `<SPANN STYLE="font-weight:bold">Prims algorithm tutorial</SPANN><br><br>
        Prim is building a MST by adding safe edges to an empty forest. 
        <br>
        <br>
        Prim starts by selecting a startvertex and adding it to a set S, 
        <br>
        <br>
        any edge with exactly one vertex in S can be added to the forest without creating a cycle, 
        if such an edge is also the least heavy edge among those edges, it is called a 
        <SPANN STYLE="font-weight:bold">safe edge</SPANN>. 
        <br>
        <br>
        Adding a safe edge to the forest also adds the new vertex to S. 
        <br>
        <br>
        Prim will continuously add safe edges.
        <br>
        <br>
        Prim is done, if all vertices are in S.`
        d3.select("#tutorialInfo").html(content)
    }
}

export {primTutorial}