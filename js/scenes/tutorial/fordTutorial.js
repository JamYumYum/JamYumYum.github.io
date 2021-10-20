import { directedMode } from "../../modus/directedMode.js";
import * as A from '../../tools/algo.js';
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
        //d3.select("#infoText").html("Ford's algorithm calculates the minimum distance paths from a single source to every other vertex. Start by clicking on a start Vertex.")
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
        this.unlock()
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
        fordTutorial.updateSelection()

        if(directedMode.totalTenseEdges == 0){
            // finish, no tense edges
            //fordTutorial.next(fordTutorial.nFinish)
            d3.select("#infoText").html(`${edge} relaxed, updated the distance of ${target}, 
            ${source} is now the predecessor of ${target}. No more tense edges, Ford is done! Press [Esc] to return.`)
            return
        }
        //fordTutorial.next(fordTutorial.nNext)
        fordTutorial.totalRelaxations += 1
    },

    nNodeClicked : function(){
        d3.select("#infoText").html(`You chose <SPAN STYLE="font-weight:bold">${directedMode.nameMap.nameMap[directedMode.currentVertex.name]}</SPAN> 
        as starting vertex. Initial distances have been generated! Tense edges are red and swollen, now click on a tense edge!`)
        //fordTutorial.next(fordTutorial.nExplainTense)
        
        for(let i = 0; i< fordTutorial.graph1.vertices.length; i++){
            fordTutorial.distance[i] = fordTutorial.graph1.vertices[i].key
            fordTutorial.predecessor[i] = ("-") 
        }
        fordTutorial.predecessor[directedMode.startVertex] = directedMode.startVertex
        console.log(fordTutorial.distance)
        fordTutorial.updateSelection()
    },
    nExplainTense : function(){
        fordTutorial.unlock()
        d3.select("#infoText").html(`For an edge, if the sum of its weight and the distance of its tail is greater than the distance 
        of its head, then the edge is called tense. A tense edge is displayed as swollen and red here. Now click on any tense edge!`)
    },
    nNext : function(){
        fordTutorial.unlock()
        d3.select("#infoText").html(`Relax another tense edge!`)
    },
    nFinish : function(){
        fordTutorial.unlock()
        d3.select("#infoText").html("Finish, no edges are tense!")
        fordTutorial.next(fordTutorial.nQuit)
        d3.select(".confirmText").html("Quit")
    },
    nQuit : function(){
        fordTutorial.unlock()
        sceneManager.enterQueue(mainMenu)
        sceneManager.nextScene()
    },


    //update sorted edges in div tag with id #selection
    updateSelection : function(extracted,firstInsert){
        let content = "Data<br><br>"
        for(let i = 0; i< this.graph1.vertices.length;i++){
            let source = `<SPAN STYLE="font-weight:bold">${directedMode.nameMap.nameMap[i]}</SPAN>`
            let target = `<SPAN STYLE="font-weight:bold">${directedMode.nameMap.nameMap[this.predecessor[i]]}</SPAN>`
            if(directedMode.nameMap.nameMap[this.predecessor[i]] == undefined){
                console.log(target)
                target = `<SPAN STYLE="font-weight:bold">-</SPAN>`
            }
            let weight = `<SPAN STYLE="font-weight:bold">${this.distance[i]}</SPAN>`
            content += `[${source}] = {dist: ${weight}, pred: ${target}}<br><br>`
        }
        d3.select("#selection").html(content)
    },
    //messages
    createMessage : function(number){
        
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