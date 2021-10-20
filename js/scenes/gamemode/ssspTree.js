import { directedMode } from "../../modus/directedMode.js";
import * as A from '../../tools/algo.js';
import * as G from '../../graphGenerator.js';
import { sceneManager } from "../sceneManager.js";
import { mainMenu } from "../mainMenu.js";
import { svg0UI } from "../../UI/svg0.js";

const ssspTree = {
    mode : undefined,   //used mode
    graph1 : undefined, //graph
    svg1 : undefined, // svg element 
    sim1 : undefined, // simulation
    name1 : "svg0", // id for grid item and class name for svg
    totalRelaxations : 0, // counter for edge relaxations
    start : function(){
        this.mode = directedMode
        svg0UI.drawUI(this.mode)
        this.restart()

        document.addEventListener("legalMove", ssspTree.ncheckState)
        document.addEventListener("keydown", ssspTree.nlogKey)
        window.addEventListener("resize", this.nrecenter)
        // UI update
        d3.select("#infoText").html("Tense edges(red) get relaxed on click. Try to relax alledges with the least amount of clicks!")
        this.updateTotal()
        this.updateCommand()
    },
    nlogKey : function(e){
        ssspTree.logKey(e)
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
        this.totalRelaxations = 0
        this.graph1 = G.mstGraph()
        A.initValue(this.graph1,0)
        directedMode.setGraph(this.graph1, 0)       
        directedMode.initiateSimulation(this.name1,this.svg1,this.sim1)
    },
    reset : function(){
        if(this.totalRelaxations > 0){
            directedMode.reset()
            this.totalRelaxations = 0
        }
        d3.select("#infoText").html("Initial state.")
        this.updateTotal()
    },
    undo : function(){
        if(this.totalRelaxations > 0){
            directedMode.undo()
            this.totalRelaxations -= 1
            d3.select("#infoText").html("Undo 1 move.")
        }
        else{
            d3.select("#infoText").html("Initial state.")
        }
        this.updateTotal()
    },
    win : function(){
        console.log("win"+this.totalRelaxations)
        d3.select("#infoText").html('You did it in <SPAN STYLE="font-weight:bold">'
        +this.totalRelaxations+'</SPAN> relaxations!')
    },
    ncheckState : function(){
        ssspTree.checkState()
    },
    checkState : function(){
        this.totalRelaxations += 1
        if(directedMode.totalTenseEdges == 0){
            this.win()
        }
        else{
            this.legalMessage()
        }
        this.updateTotal()
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()
    },
    nrecenter : function(){
        ssspTree.mode.recenter()
    },
    exit : function(){
        this.cleanup()
        svg0UI.cleanupUI()
        document.removeEventListener("legalMove", ssspTree.ncheckState)
        document.removeEventListener("keydown", ssspTree.nlogKey)
        window.removeEventListener("resize", this.nrecenter)
    },
    //message
    legalMessage : function(){
        let source = ssspTree.mode.nameMap.nameMap[ssspTree.mode.selection[ssspTree.mode.selection.length-1].source.index]
        let target = ssspTree.mode.nameMap.nameMap[ssspTree.mode.selection[ssspTree.mode.selection.length-1].target.index]
        d3.select("#infoText").html(`<SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${source}${target}
        </SPAN> relaxed!`)
    },
    //total update
    updateTotal : function(){
        d3.select("#total").html(`Total relaxations<br>${this.totalRelaxations}`)
    },
    //command display
    updateCommand : function(){
        let content = "[E] Undo" + "<br>"
        + "[R] Reset" + "<br>"
        + "[Q] New Graph" + "<br>"
        + "[Esc] Return to Main Menu"
        d3.select("#command").html(content)
    }
}

export {ssspTree}