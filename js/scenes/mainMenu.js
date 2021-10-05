import { buildMST } from "./gamemode/buildMST.js";
import { mstSelectN } from "./gamemode/mstSelectN.js";
import { ssspTree } from "./gamemode/ssspTree.js";
import { vsDijkstra } from "./gamemode/vsDijkstra.js";
import { primTutorial } from "./tutorial/primTutorial.js";
import { sceneManager } from "./sceneManager.js";

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
            case "Digit1":
                sceneManager.enterQueue(buildMST)
                sceneManager.nextScene()
                break
            case "Digit2":
                sceneManager.enterQueue(mstSelectN)
                sceneManager.nextScene()
                break
            case "Digit3":
                sceneManager.enterQueue(ssspTree)
                sceneManager.nextScene()
                break
            case "Digit4":
                sceneManager.enterQueue(vsDijkstra)
                sceneManager.nextScene()
                break
            case "Digit5":
                sceneManager.enterQueue(primTutorial)
                sceneManager.nextScene()
                break
        }
    },
    drawUI: function(){
        document.addEventListener("keydown", this.nlogKey)
    },
    exit: function(){
        console.log("called exit")
        document.removeEventListener("keydown", this.nlogKey)
    }
}

export {mainMenu}