import { directedMode } from "../../modus/directedMode.js";
import * as A from '../../algo.js';
import * as G from '../../graphGenerator.js';

const ssspTree = {
    graph1 : undefined,
    svg1 : undefined,
    sim1 : undefined,
    name1 : "svg0",
    totalRelaxations : 0,
    start : function(){
        //initiate 2 force simulations
        this.restart()

        document.addEventListener("legalMove", ()=> ssspTree.checkState())
        document.addEventListener("keydown", ssspTree.logKey.bind(this))
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
    checkState : function(){
        this.totalRelaxations += 1
        if(directedMode.totalTenseEdges == 0){
            this.win()
        }
    },
    exit : function(){
        //TODO cleanup all UI elements, forcedirected graph
        document.removeEventListener("legalMove", ()=> vsDijkstra.checkState())
        document.removeEventListener("keydown", vsDijkstra.logKey)
    }
}

export {ssspTree}