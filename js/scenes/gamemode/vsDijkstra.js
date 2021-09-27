import { directedMode } from "../../modus/directedMode.js";
import { vsDijkstraGraph } from "../../modus/vsDijkstraGraph.js";
import * as A from '../../algo.js';
import * as G from '../../graphGenerator.js';

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
        this.restart()

        document.addEventListener("legalMove", ()=> vsDijkstra.checkState())
        document.addEventListener("keydown", vsDijkstra.logKey.bind(this))
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
        vsDijkstraGraph.cleanup()
        this.totalRelaxations = 0
        this.graph1 = G.mstGraph()
        A.initValue(this.graph1,0)
        this.graph2 = G.copyGraph(this.graph1)
        this.dijkstraData = A.dijkstra(this.graph2, 0)
        directedMode.setGraph(this.graph1)
        vsDijkstraGraph.setGraph(this.graph2)
        directedMode.initiateSimulation(this.name1,this.svg1,this.sim1)//.then(directedMode.test())
        vsDijkstraGraph.initiateSimulation(this.name2,this.svg2,this.sim2)
        vsDijkstraGraph.freeze = true
    },
    reset : function(){
        //TODO reset state
        if(this.totalRelaxations > 0){
            directedMode.reset()
            vsDijkstraGraph.reset()
            this.totalRelaxations = 0
        }
    },
    undo : function(){
        //TODO undo last move
        if(this.totalRelaxations > 0){
            directedMode.undo()
            vsDijkstraGraph.undo()
            this.totalRelaxations -= 1
        }

    },
    win : function(){
        //TODO called when player has no more tense edges
        console.log("win"+this.totalRelaxations)
    },
    lose : function(){
        //TODO called when dijkstra has no more tense edges
        console.log("lose"+this.totalRelaxations)
    },
    draw : function(){
        //TODO called when both have no more tense edges
        console.log("draw")
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
    },
    exit : function(){
        //TODO cleanup all UI elements, forcedirected graph
        document.removeEventListener("legalMove", ()=> vsDijkstra.checkState())
        document.removeEventListener("keydown", vsDijkstra.logKey)
    }
}

export{vsDijkstra}