import { directedMode } from "../../modus/directedMode.js";
import * as G from '../../tools/graphGenerator.js';
import { sceneManager } from "../sceneManager.js";
import { mainMenu } from "../mainMenu.js";
import { svg0UI } from "../../UI/svg0.js";

const fordTutorial = {
    mode : undefined,   //used mode
    graph1 : undefined, //graph
    svg1 : undefined, // svg element 
    sim1 : undefined, // simulation
    name1 : "svg0", // id for grid item and class name for svg
    totalRelaxations : 0, // counter for edge relaxations
    distance : [],
    predecessor : [],
    start : function(){
        this.mode = directedMode
        svg0UI.drawUI(this.mode)
        this.graph1 = G.tutorialGraph()
        this.mode.setGraph(this.graph1)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        this.totalRelaxations = 0
        this.distance = []
        this.predecessor = []
        for(let i = 0; i< this.graph1.vertices.length; i++){
            this.distance.push(this.graph1.vertices[i].key)
            this.predecessor.push("-") 
        }
        
        document.addEventListener("legalMove", fordTutorial.nRelax)
        document.addEventListener("nodeClicked", fordTutorial.nNodeClicked)
        document.addEventListener("keydown", fordTutorial.nlogKey)
        window.addEventListener("resize", this.nrecenter)
        
        this.updateCommand()
        this.updateInfo()
        d3.select("#infoText").html("Ford's algorithm tutorial. Start by selecting a vertex. Click on any one.")
    },
    nlogKey : function(e){
        fordTutorial.logKey(e)
    },
    logKey : function(e){
        switch(e.code){
            case "Escape":
                sceneManager.enterQueue(mainMenu)
                sceneManager.nextScene()
                break
        }    
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()
    },
    nrecenter : function(){
        fordTutorial.mode.recenter()
    },

    exit : function(){
        this.cleanup()
        svg0UI.cleanupUI()
        document.removeEventListener("legalMove", fordTutorial.nRelax)
        document.removeEventListener("nodeClicked", fordTutorial.nNodeClicked)
        document.removeEventListener("keydown", fordTutorial.nlogKey)
        window.removeEventListener("resize", this.nrecenter)
    },
    // on relax actions here
    nRelax : function(){
        
        let s = directedMode.nameMap.nameMap[directedMode.currentEdge.source.name]
        let t = directedMode.nameMap.nameMap[directedMode.currentEdge.target.name]
        let source = `<SPAN STYLE="font-weight:bold">${s}</SPAN>`
        let target = `<SPAN STYLE="font-weight:bold">${t}</SPAN>`
        let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${s}${t}</SPAN>`
        if(fordTutorial.totalRelaxations == 0){
            // first relaxation
            d3.select("#infoText").html(`${edge} has been relaxed, which means you updated the distance of 
            ${target}! ${edge} is now marked in yellow, 
            showing that ${source} is now the predecessor of ${target}. Now relax more edges.`)
        }
        else{
            d3.select("#infoText").html(`${edge} relaxed, updated the distance of ${target}, 
            ${source} is now the predecessor of ${target}. Relax more Edges!`)
        }
        fordTutorial.predecessor[directedMode.currentEdge.target.name] = directedMode.currentEdge.source.name
        fordTutorial.distance[directedMode.currentEdge.target.name] = directedMode.ssspHelp.distance[directedMode.currentEdge.target.name]

        if(directedMode.totalTenseEdges == 0){
            // finish, no tense edges
            d3.select("#infoText").html(`${edge} relaxed, updated the distance of ${target}, 
            ${source} is now the predecessor of ${target}. No more tense edges, Ford is done! Press [Esc] to return.`)
            return
        }
        fordTutorial.totalRelaxations += 1
    },

    nNodeClicked : function(){
        d3.select("#infoText").html(`You chose <SPAN STYLE="font-weight:bold">${directedMode.nameMap.nameMap[directedMode.currentVertex.name]}</SPAN> 
        as starting vertex. Initial distances have been generated! Tense edges are red and swollen, now click on a tense edge!`)
        
        for(let i = 0; i< fordTutorial.graph1.vertices.length; i++){
            fordTutorial.distance[i] = fordTutorial.graph1.vertices[i].key
            fordTutorial.predecessor[i] = ("-") 
        }
        fordTutorial.predecessor[directedMode.startVertex] = directedMode.startVertex
        console.log(fordTutorial.distance)
        fordTutorial.updateSelection()
    },
    //command display
    updateCommand : function(){
        let content = "[Esc] Return to Main Menu"
        d3.select("#command").html(content)
    },
    //update tutorial info
    updateInfo : function(){
        d3.select("#grid1").append("div").attr("id", "tutorialInfo")
        let content = `<SPANN STYLE="font-weight:bold">Fords algorithm tutorial</SPANN><br><br>
        Start by choosing the single source vertex and initiating all distances to it.
        Ford is building a SSSP-tree by relaxing all tense edges.
        <br>
        <br>
        If an edge has a head vertex with a higher distance than its tail vertex distance in addition to its own edge
        weight, then it is a <SPANN STYLE="font-weight:bold">tense</SPANN> edge.
        <br>
        <br>
        If a tense edge gets <SPANN STYLE="font-weight:bold">relaxed</SPANN>, then it updates its head vertex distance 
        to the sum of its tail vertex distance and its own weight, additionaly the predecessor of the head vertex is now the 
        tail vertex. 
        <br>
        <br>
        Ford relaxes tense edges, as long as there are any. 
        <br>
        <br>
        Ford is done, if there are no more tense edges.
        `
        d3.select("#tutorialInfo").html(content)
    }
}

export {fordTutorial}