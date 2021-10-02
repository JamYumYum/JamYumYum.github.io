import { directedMode } from "../../modus/directedMode.js";
import * as A from '../../algo.js';
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
        directedMode.setGraph(this.graph1)
        directedMode.initiateSimulation(this.name1,this.svg1,this.sim1)
    },
    reset : function(){
        //TODO reset state
        if(this.totalRelaxations > 0){
            directedMode.reset()
            this.totalRelaxations = 0
        }
    },
    undo : function(){
        //TODO undo last move
        if(this.totalRelaxations > 0){
            directedMode.undo()
            this.totalRelaxations -= 1
        }

    },
    win : function(){
        //TODO called when player has no more tense edges
        console.log("win"+this.totalRelaxations)
    },
    ncheckState : function(){
        ssspTree.checkState()
    },
    checkState : function(){
        this.totalRelaxations += 1
        if(directedMode.totalTenseEdges == 0){
            this.win()
        }
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()
    },
    nrecenter : function(){
        ssspTree.mode.recenter()
    },
    exit : function(){
        //TODO cleanup all UI elements, forcedirected graph
        this.cleanup()
        svg0UI.cleanupUI()
        document.removeEventListener("legalMove", ssspTree.ncheckState)
        document.removeEventListener("keydown", ssspTree.nlogKey)
        window.removeEventListener("resize", this.nrecenter)
    }
}

export {ssspTree}