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
            case "Digit5":
                sceneManager.enterQueue(buildMST)
                sceneManager.nextScene()
                break
            case "Digit6":
                sceneManager.enterQueue(mstSelectN)
                sceneManager.nextScene()
                break
            case "Digit7":
                sceneManager.enterQueue(ssspTree)
                sceneManager.nextScene()
                break
            case "Digit8":
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
        d3.select("body").append("div").html("press 1 for prim tutorial")
        d3.select("body").append("div").html("press 2 for kruskal tutorial")
        d3.select("body").append("div").html("press 3 for ford tutorial")
        d3.select("body").append("div").html("press 5 for game build mst")
        d3.select("body").append("div").html("press 6 for game select like prim/kruskal")
        d3.select("body").append("div").html("press 7 for game build sssp tree")
        d3.select("body").append("div").html("press 8 for game vs dijkstra")
    },
    exit: function(){
        console.log("called exit")
        document.removeEventListener("keydown", this.nlogKey)
        d3.selectAll("div").remove()
    }
}

export {mainMenu}