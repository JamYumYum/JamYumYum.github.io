import { buildMST } from "./gamemode/buildMST.js";
import { mstSelectN } from "./gamemode/mstSelectN.js";
import { ssspTree } from "./gamemode/ssspTree.js";
import { vsDijkstra } from "./gamemode/vsDijkstra.js";
import { primTutorial } from "./tutorial/primTutorial.js";
import { sceneManager } from "./sceneManager.js";
import { kruskalTutorial } from "./tutorial/kruskalTutorial.js";
import { fordTutorial } from "./tutorial/fordTutorial.js";
const mainMenu = {
    start : function(){
        this.active = true
        this.drawUI()
    },
    nlogKey : function(e){
        mainMenu.logKey(e)
    },
    logKey : function(e){
        console.log(e)
        switch(e.code){
            case "Digit4":
                sceneManager.enterQueue(buildMST)
                sceneManager.nextScene()
                break
            case "Digit5":
                sceneManager.enterQueue(mstSelectN)
                sceneManager.nextScene()
                break
            case "Digit6":
                sceneManager.enterQueue(ssspTree)
                sceneManager.nextScene()
                break
            case "Digit7":
                sceneManager.enterQueue(vsDijkstra)
                sceneManager.nextScene()
                break
            case "Digit1":
                sceneManager.enterQueue(primTutorial)
                sceneManager.nextScene()
                break
            case "Digit2":
                sceneManager.enterQueue(kruskalTutorial)
                sceneManager.nextScene()
                break
            case "Digit3":
                sceneManager.enterQueue(fordTutorial)
                sceneManager.nextScene()
                break
        }
    },
    drawUI: function(){
        document.addEventListener("keydown", this.nlogKey)
        let grid = d3.select("body").append("div").classed("mainMenu", true)
        grid.append("div").classed("title",true).html("Visualization: MST & SSSP")
        grid.append("div").classed("press1",true).html("Press 1 for prim tutorial")
        grid.append("div").classed("press2",true).html("Press 2 for kruskal tutorial")
        grid.append("div").classed("press3",true).html("Press 3 for ford tutorial")
        grid.append("div").classed("press4",true).html("Press 4 for game build mst")
        grid.append("div").classed("press5",true).html("Press 5 for game select like prim/kruskal")
        grid.append("div").classed("press6",true).html("Press 6 for game build sssp tree")
        grid.append("div").classed("press7",true).html("Press 7 for game vs dijkstra")
    },
    exit: function(){
        console.log("called exit")
        document.removeEventListener("keydown", this.nlogKey)
        d3.selectAll("div").remove()
    }
}

export {mainMenu}