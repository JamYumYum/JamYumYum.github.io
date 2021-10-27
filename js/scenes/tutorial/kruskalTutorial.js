import * as G from '../../tools/graphGenerator.js';
import * as A from '../../tools/algo.js'
import { svg0UI } from "../../UI/svg0.js";
import { mainMenu } from "../mainMenu.js";
import { sceneManager } from "../sceneManager.js";
import { kruskalMode } from '../../modus/kruskalMode.js';

const kruskalTutorial = {
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
        this.mode = kruskalMode
        svg0UI.drawUI(this.mode)
        this.graph = G.tutorialGraph()
        this.algoGraph = G.copyGraph(this.graph)
        this.kruskalData = A.kruskal(this.algoGraph)
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        this.step = 0

        document.addEventListener("legalMove", kruskalTutorial.nAddEdge)
        document.addEventListener("illegalMove", kruskalTutorial.nIgnore)
        document.addEventListener("keydown", kruskalTutorial.nlogKey)
        window.addEventListener("resize", this.nrecenter)

        d3.select("#infoText").html("Kruskals algorithm tutorial. Connected components are tagged and colorized! Start by clicking on a safe edge!")
        this.updateCommand()
        this.updateInfo()
    },
    nlogKey : function(e){
        kruskalTutorial.logKey(e)
    },
    logKey : function(e){
        switch(e.code){
            case "Escape":
                sceneManager.enterQueue(mainMenu)
                sceneManager.nextScene()
                break
        }    
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
        kruskalTutorial.mode.recenter()
    },
    exit : function(){
        this.cleanup()
        svg0UI.cleanupUI()
        document.removeEventListener("legalMove", kruskalTutorial.nAddEdge)
        document.removeEventListener("illegalMove", kruskalTutorial.nIgnore)
        document.removeEventListener("keydown", kruskalTutorial.nlogKey)
        window.removeEventListener("resize", this.nrecenter)
    },

    nAddEdge : function(){
        kruskalTutorial.addEdge()
    },
    // actions if edge was clicked
    addEdge : function(){
        let source = kruskalMode.nameMap.nameMap[kruskalMode.currentEdge.source.name]
        let target = kruskalMode.nameMap.nameMap[kruskalMode.currentEdge.target.name]
        let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">${source}${target}</SPAN>`
        if(kruskalMode.goodMove()){
            d3.select("#infoText").html(`${edge} is a safe edge! Select the next safe edge!`)
            this.step+=1
            if(kruskalMode.selection.length == this.graph.vertices.length -1){
                d3.select("#infoText").html(`${edge} is a safe edge! Every vertex is now in the same connected component and you have built a MST, Kruskal is now done! Press [Esc] to return to the main menu.`)

            }
        }
        else{
            d3.select("#infoText").html(`${edge} wouldn't create a cycle, but it is not the edge Kruskal is looking for!`)
            kruskalMode.undo()
        }
    },
    nIgnore : function(){
        kruskalTutorial.ignore()
    },
    ignore : function(){
        console.log(this.kruskalData)
        console.log(this.step)
            //nothing should happen here, so restore edge to default
        if(kruskalMode.selection.length == this.graph.vertices.length -1) return
            let source = kruskalMode.nameMap.nameMap[kruskalMode.currentEdge.source.name]
            let target = kruskalMode.nameMap.nameMap[kruskalMode.currentEdge.target.name]
            let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">${source}${target}</SPAN>`
            d3.select("#infoText").html(`${edge} is not a safe edge, try another edge!`)
            kruskalMode.ignore[kruskalMode.currentEdge.index] = false
    },
    //command display
    updateCommand : function(){
        let content = "[Esc] Return to Main Menu"
        d3.select("#command").html(content)
    },
    //update tutorial info
    updateInfo : function(){
        d3.select("#grid1").append("div").attr("id", "tutorialInfo")
        let content = `<SPANN STYLE="font-weight:bold">Kruskals algorithm tutorial</SPANN><br><br>
        Kruskal is building a MST by adding safe edges to an empty forest. 
        <br>
        <br>
        Kruskal creates an empty forest with all vertices in their own connected component, then he checks the 
        edges in ascending order,
        <br>
        <br>
        if the current edge has its vertices in different connected components, then 
        it is called a 
        <SPANN STYLE="font-weight:bold">safe edge</SPANN>. 
        <br>
        <br>
        Adding a safe edge will merge the connected components, which contain its vertices.
        <br>
        <br>
        Kruskal will continuously add safe edges. 
        <br>
        <br>
        Kruskal is done, if all vertices are in the same connected component.`
        d3.select("#tutorialInfo").html(content)
    }
}

export {kruskalTutorial}