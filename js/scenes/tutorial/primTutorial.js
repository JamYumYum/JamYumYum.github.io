import { primMode } from "../../modus/primMode.js"
import * as G from '../../graphGenerator.js';
import * as A from '../../algo.js'
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
    lock : undefined,
    extractedEdge: undefined,
    start : function(){
        this.mode = primMode
        svg0UI.drawUI(this.mode)
        this.graph = G.tutorialGraph() // TODO custom graph
        this.algoGraph = G.copyGraph(this.graph)
        //this.primData = A.prim(this.graph, 0)
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
        //this.updateSelection()
    },
    undo(){
        if(this.edgeSelection.length != 0){
            let e = this.mode.selection[this.mode.selection.length-1]
            this.mode.undo()
            this.totalWeight -= e.key
            this.step -= 1
            //d3.select("#infoText").html("Undo 1 move.")
        }
        else{
            //d3.select("#infoText").html("Initial state.")
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
        d3.select("#infoText").html(primTutorial.createMessage(1))
        console.log(primTutorial.primData)
    },
    nAddEdge : function(){
        primTutorial.addEdge()
    },
    // actions if edge was clicked
    addEdge : function(){
        //console.log(this.primData.pQueueStep[this.step][1])
        //console.log(primMode.selection[primMode.selection.length-1])
        if(primMode.selection[primMode.selection.length-1].source.name == this.primData.pQueueStep[this.step][1].source
            && primMode.selection[primMode.selection.length-1].target.name == this.primData.pQueueStep[this.step][1].target){
            // minEdge clicked
            if(this.step == 0){
                d3.select("#infoText").html(primTutorial.createMessage(4))
            }
            else{
                d3.select("#infoText").html(primTutorial.createMessage(7))
            }

            this.step += 1
        }
        else{
            d3.select("#infoText").html(primTutorial.createMessage(10))
            primMode.undo()
        }
    },
    nIgnore : function(){
        primTutorial.ignore()
    },
    ignore : function(){
        console.log(this.primData.pQueueStep[this.step][1])
        console.log(primMode.selection[primMode.selection.length-1])
        if(primMode.currentEdge.source.name == this.primData.pQueueStep[this.step][1].source
            && primMode.currentEdge.target.name == this.primData.pQueueStep[this.step][1].target){
            // minEdge clicked
            console.log("reach")
            d3.select("#infoText").html(this.createMessage(8))

            this.step += 1
            if(this.primData.pQueueStep.length-2 < this.step){
                d3.select("#infoText").html("Finish! Priority queue empty!")

                //Lock svg 
                d3.select("body").append("div").classed("lock", true)
                d3.select("#infoText").append("div").classed("confirm", true)
                d3.select(".confirm").on("mousedown", v=>{
                    console.log("unlock")
                    d3.select(".lock").remove()
                    d3.select(".confirm").remove()
                })
                return
            }
        }
        else{
            //nothing should happen here, so restore edge to default
            d3.select("#infoText").html(this.createMessage(10))
            primMode.ignore[primMode.currentEdge.index] = false
            primMode.update()
        }
    },
    nIgnore2 : function(){
        primTutorial.ignore2()
    },
    ignore2 : function(){
        //Lock svg 
        d3.select("body").append("div").classed("lock", true)
        d3.select("body").append("div").classed("confirm", true)
        d3.select(".confirm").append("div").classed("confirmText", true).html("OK")
        d3.select(".confirm").on("mousedown", v=>{
            console.log("unlock")
            d3.select(".lock").remove()
            d3.select(".confirm").remove()
        })
        d3.select("#infoText").html(this.createMessage(10))
    },
    //total update
    updateTotal : function(){
        d3.select("#total").html(`Total weight<br>${this.totalWeight}`)
    },

    //messages
    initMessages : function(){
        // starting message, select starting vertex
        this.messages[0] = "Prim's algorithm tutorial. Start by Selecting a Vertex. Click on any one."
        //LOCK vertex selected
        this.messages[1] = `You have selected 
        ${primMode.nameMap.nameMap[primMode.startVertex]} as 
        starting Vertex. It will now be marked as visited (blue).`
        // more explanation, safe edges
        this.messages[2] = ``
        this.messages[3] = ``
        this.messages[4] = ``
        this.messages[5] = ``
        this.messages[6] = ``
    },
    createMessage : function(number){
        let source
        let target
        let initialEdges
        let minEdge
        source =primMode.nameMap.nameMap[this.primData.pQueueStep[this.step][1].source]
        target =primMode.nameMap.nameMap[this.primData.pQueueStep[this.step][1].target]
        minEdge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">
                   ${source}${target}</SPAN>`
        switch (number) {
            case 0:
                //ALLOW INTERACTION starting message, select starting vertex
                return "Prim's algorithm tutorial. Start by Selecting a Vertex. Click on any one."
            case 1:
                //DENY INTERACTION vertex selected
                return `You have selected <SPAN STYLE="font-weight:bold">
                ${primMode.nameMap.nameMap[primMode.startVertex]} </SPAN>as 
                starting Vertex. It will now be added to your tree (blue). 
                The new yellow edges are safe edges, which means adding these edges to the tree wont create a cycle.`
            case 2:
                // adding initial edges to pqueue
                initialEdges = ""
                for(let i = 0; i< this.primData.pQueueStep[0].length;i++){
                    source =primMode.nameMap.nameMap[this.primData.pQueueStep[0][i+1].source.name]
                    target =primMode.nameMap.nameMap[this.primData.pQueueStep[0][i+1].target.name]
                    initialEdges += `<SPAN STYLE="text-decoration:overline; font-weight:bold">
                    ${source}${target}</SPAN>`
                    if(i != this.primData.pQueueStep[0].length-1){
                        initialEdges += ", "
                    }
                }
                return `${initialEdges} have been added to the priority queue.`
            case 3:
                //ALLOW INTERACTION extract first minEdge, request click
                //this.primData.pQueueStep[this.step - 1][1]
                source =primMode.nameMap.nameMap[this.primData.pQueueStep[0][1].source]
                target =primMode.nameMap.nameMap[this.primData.pQueueStep[0][1].target]
                minEdge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">
                ${source}${target}</SPAN>`
                return `Prim will now start the main loop. Extract the minimum weight edge ${minEdge} from the priority queue. 
                Now try to click on ${minEdge}.`
            case 4:
                //DENY INTERACTION added min edge to tree
                source =primMode.nameMap.nameMap[this.primData.pQueueStep[0][1].source]
                target =primMode.nameMap.nameMap[this.primData.pQueueStep[0][1].target]
                minEdge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">
                ${source}${target}</SPAN>`

                return `${minEdge} does not connect two vertices in the tree, so ${minEdge} will 
                be added to the tree(turning red). The new neighbouring vertex will also be added and turn blue.`
            case 5:
                //insert neighbouring edges to pQueue
                return ``
            case 6:
                //ALLOW INTERACTION loop start extract minEDge request click
                return `Extract the minimum weight edge ${minEdge} from the priority queue. 
                Click on ${minEdge}.`
            case 7:
                //DENY INTERACTION added min edge to tree
                return `${minEdge} is a safe edge, added to the tree.`
            case 8:
                // DENY INTERACTION min EDGE not safe
                return `${minEdge} is NOT a safe edge, not added.`
            case 9:
                //insert neigbouring edges to pQueue
                return ``
            case 10:
                //DENY INTERACTION clicked not on minEdge
                return `You did NOT click on ${minEdge}! CLICK ON ${minEdge} to proceed!`
        }
    }
}

export {primTutorial}