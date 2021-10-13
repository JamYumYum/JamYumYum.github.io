import { directedMode } from "../../modus/directedMode.js";
import * as A from '../../algo.js';
import * as G from '../../graphGenerator.js';
import { sceneManager } from "../sceneManager.js";
import { mainMenu } from "../mainMenu.js";
import { svg0UI } from "../../UI/svg0.js";
import PQueue from '../../ds/pQueue.js'

const dijkstraTutorial = {
    mode : undefined,   //used mode
    graph1 : undefined, //graph
    algoGraph : undefined,
    dijkstraData : undefined,
    svg1 : undefined, // svg element 
    sim1 : undefined, // simulation
    name1 : "svg0", // id for grid item and class name for svg
    totalRelaxations : 0, // counter for edge relaxations
    distance : [],
    predecessor : [],
    pQueue : undefined,
    start : function(){
        this.mode = directedMode
        svg0UI.drawUI(this.mode)
        this.graph1 = G.tutorialGraph() // TODO custom graph
        this.algoGraph = G.copyGraph(this.graph)
        this.mode.setGraph(this.graph1)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        this.totalRelaxations = 0
        this.distance = []
        this.predecessor = []
        this.pQueue = new PQueue()
        for(let i = 0; i< this.graph1.vertices.length; i++){
            this.distance.push(this.graph1.vertices[i].key)
            this.predecessor.push("-") 
        }

        document.addEventListener("legalMove", dijkstraTutorial.nRelax)
        document.addEventListener("nodeClicked", dijkstraTutorial.nNodeClicked)
        document.addEventListener("keydown", dijkstraTutorial.nlogKey)
        window.addEventListener("resize", this.nrecenter)

    },
    nlogKey : function(e){
        dijkstraTutorial.logKey(e)
    },
    logKey : function(e){
        switch(e.code){
            case "Escape":
                sceneManager.enterQueue(mainMenu)
                sceneManager.nextScene()
                 let a= 1
                break
        }    
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()
    },
    nrecenter : function(){
        dijkstraTutorial.mode.recenter()
    },

    exit : function(){
        this.cleanup()
        svg0UI.cleanupUI()
        this.unlock()
        document.removeEventListener("legalMove", dijkstraTutorial.nRelax)
        document.removeEventListener("nodeClicked", dijkstraTutorial.nNodeClicked)
        document.removeEventListener("keydown", dijkstraTutorial.nlogKey)
        window.removeEventListener("resize", this.nrecenter)
    },
    nRelax : function(){

    },

    nNodeClicked : function(){

        for(let i = 0; i< dijkstraTutorial.graph1.vertices.length; i++){
            dijkstraTutorial.distance[i] = dijkstraTutorial.graph1.vertices[i].key
            dijkstraTutorial.predecessor[i] = ("-")
        }

        dijkstraTutorial.predecessor[directedMode.startVertex] = directedMode.startVertex
        dijkstraTutorial.dijkstraData = A.dijkstra(dijkstraTutorial.algoGraph, directedMode.startVertex)
    },




    lock : function(){
        //Lock svg, click on button to unlock
        d3.select("body").append("div").classed("lock", true)
        d3.select("body").append("div").classed("confirm", true)
        d3.select(".confirm").append("div").classed("confirmText", true).html("OK")
        d3.select(".confirm").on("mousedown", v=>{
            console.log("unlock")
            d3.select(".lock").remove()
            d3.select(".confirm").remove()
        })
    },
    unlock : function(){
        //remove the lock
        console.log("unlock")
        d3.select(".lock").remove()
        d3.select(".confirm").remove()
    },
    next : function(nextFunction, parameter1){
        //lock svg, continues after button click
        d3.select("body").append("div").classed("lock", true)
        d3.select("body").append("div").classed("confirm", true).classed("next",true)
        d3.select(".confirm").append("div").classed("confirmText", true).html("Next")
        d3.select(".confirm").on("mousedown", v=>{nextFunction(parameter1)})
    },
    //command display
    updateCommand : function(){
        let content = "Commands Keybind<br>"
        + "[Esc] Return to Main Menu"
        d3.select("#command").html(content)
    }
}

export {dijkstraTutorial}