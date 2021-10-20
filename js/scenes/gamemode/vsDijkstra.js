import { directedMode } from "../../modus/directedMode.js";
import { vsDijkstraGraph } from "../../modus/vsDijkstraGraph.js";
import * as A from '../../tools/algo.js';
import * as G from '../../graphGenerator.js';
import { sceneManager } from "../sceneManager.js";
import { mainMenu } from "../mainMenu.js";
import {svg12UI} from "../../UI/svg12.js";

const vsDijkstra = {
    graph1 : undefined,
    graph2 : undefined,
    svg1 : undefined,
    svg2 : undefined,
    sim1 : undefined,
    sim2 : undefined,
    name1 : "svg1",
    name2 : "svg2",
    dijkstraData : undefined,
    totalRelaxations : 0,
    start : function(){
        //initiate 2 force simulations
        svg12UI.drawUI(directedMode, vsDijkstraGraph)
        this.restart()

        document.addEventListener("legalMove", vsDijkstra.ncheckState)
        document.addEventListener("keydown", vsDijkstra.nlogKey)
        window.addEventListener("resize", this.nrecenter)
        //UI update
        d3.select("#infoText2").html("Remove all tense edges with less relaxations than Dijkstra!")
        this.updateTotal()
        this.updateCommand()
    },
    nlogKey : function(e){
        vsDijkstra.logKey(e)
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
                d3.select("#infoText2").html("Created new Graph!")
                this.updateTotal()
                break
            case "Escape":
                sceneManager.enterQueue(mainMenu)
                sceneManager.nextScene()
                break
        }
    },
    restart : async function(){
        directedMode.cleanup()
        vsDijkstraGraph.cleanup()
        this.totalRelaxations = 0
        this.graph1 = G.mstGraph()
        A.initValue(this.graph1,0)
        this.graph2 = G.copyGraph(this.graph1)
        this.dijkstraData = A.dijkstra(this.graph2, 0)
        directedMode.setGraph(this.graph1,0)
        vsDijkstraGraph.setGraph(this.graph2)
        directedMode.initiateSimulation(this.name1,this.svg1,this.sim1)//.then(directedMode.test())
        vsDijkstraGraph.initiateSimulation(this.name2,this.svg2,this.sim2)
        vsDijkstraGraph.freeze = true
        directedMode.freeze = false
        //console.log(this.dijkstraData)
    },
    reset : function(){
        if(this.totalRelaxations > 0){
            directedMode.reset()
            vsDijkstraGraph.reset()
            this.totalRelaxations = 0
        }
        d3.select("#infoText2").html("Initial state.")
        this.updateTotal()
        directedMode.freeze = false
    },
    undo : function(){
        if(this.totalRelaxations > 0){
            directedMode.undo()
            vsDijkstraGraph.undo()
            this.totalRelaxations -= 1
            d3.select("#infoText2").html("Undo 1 move.")
        }
        else{
            d3.select("#infoText2").html("Initial state.")
        }
        this.updateTotal()
        directedMode.freeze = false

    },
    win : function(){
        console.log("win"+this.totalRelaxations)
        d3.select("#infoText2").html("You win!")
    },
    lose : function(){
        console.log("lose"+this.totalRelaxations)
        d3.select("#infoText2").html("You lose!")
        directedMode.freeze = true
    },
    draw : function(){
        console.log("draw")
        d3.select("#infoText2").html("Draw!")
    },
    ncheckState : function(){
        vsDijkstra.checkState()
    },
    checkState : function(){
        //called after every move, checking if someone is done(win/lose), increment clicks
        vsDijkstraGraph.dijkstraClick(this.totalRelaxations)
        this.totalRelaxations += 1
        console.log(this.totalRelaxations)
        console.log("Relaxations: "+this.totalRelaxations)
        if(directedMode.totalTenseEdges != 0){
            //player not done yet
            if(vsDijkstraGraph.totalTenseEdges == 0){
                //dijkstra done
                this.lose()
            }
            else{
                //continue
                this.legalMessage()
            }
        }
        else{
            //player done
            if(vsDijkstraGraph.totalTenseEdges == 0){
                //dijkstra done
                this.draw()
            }
            else{
                // dijkstra not done
                this.win()
            }
        }
        this.updateTotal()
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()

        d3.selectAll("svg."+this.name2)
        .remove()
    },
    nrecenter : function(){
        directedMode.recenter()
        vsDijkstraGraph.recenter()
    },
    exit : function(){
        directedMode.cleanup()
        vsDijkstraGraph.cleanup()
        svg12UI.cleanupUI()
        document.removeEventListener("legalMove", vsDijkstra.ncheckState)
        document.removeEventListener("keydown", vsDijkstra.nlogKey)
        window.removeEventListener("resize", this.nrecenter)
    },
    //message
    legalMessage : function(){
        let source = directedMode.nameMap.nameMap[directedMode.selection[directedMode.selection.length-1].source.index]
        let target = directedMode.nameMap.nameMap[directedMode.selection[directedMode.selection.length-1].target.index]
        d3.select("#infoText2").html(`<SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${source}${target}</SPAN> relaxed!`)
    },
    //total update
    updateTotal : function(){
        d3.select("#total2").html(`Total relaxations<br>${this.totalRelaxations}`)
    },
    //command display
    updateCommand : function(){
        let content = "[E] Undo" + "<br>"
        + "[R] Reset" + "<br>"
        + "[Q] New Graph" + "<br>"
        + "[Esc] Return to Main Menu"
        d3.select("#command2").html(content)
    }
}

export{vsDijkstra}