import * as G from '../../graphGenerator.js';
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

        //d3.select("#infoText").html(this.createMessage(0))
        d3.select("#infoText").html("Kruskals algorithm tutorial. Connected components are tagged and colorized! Start by clicking on a safe edge!")
        this.updateCommand()
        this.updateInfo()
        //this.next(this.nFirstClick)
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
            //d3.select("#infoText").html("Undo 1 move.")
        }
        else{
            //d3.select("#infoText").html("Initial state.")
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
        this.unlock()
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
            /*
            //minEdge clicked
            if(this.step ==0){
                //first time adding
                console.log(this.step)
                d3.select("#infoText").html(kruskalTutorial.createMessage(8))
                this.next(this.nFirstUnion)
            }
            else{
                //mainloop
                d3.select("#infoText").html(kruskalTutorial.createMessage(8))
                this.next(this.nSuccess)
            }
            */
            //kruskalTutorial.updateSelection(true)
            d3.select("#infoText").html(`${edge} is a safe edge! Select the next safe edge!`)
            this.step+=1
            if(kruskalMode.selection.length == this.graph.vertices.length -1){
                d3.select("#infoText").html(`${edge} is a safe edge! Every vertex is now in the same connected component and you have built a MST, Kruskal is now done! Press [Esc] to return to the main menu.`)

            }
        }
        else{
            //nothing should happen here, so restore edge to default, rquest to click on minEDge
            //d3.select("#infoText").html(kruskalTutorial.createMessage(7))
            d3.select("#infoText").html(`${edge} wouldn't create a cycle, but it is not the edge Kruskal is looking for!`)
            kruskalMode.undo()
            //Lock svg 
            //this.lock()
        }
    },
    nIgnore : function(){
        kruskalTutorial.ignore()
    },
    ignore : function(){
        console.log(this.kruskalData)
        console.log(this.step)
        /*
        if(kruskalMode.currentEdge.source.index == this.kruskalData.edgeStep[this.step][0].source
            && kruskalMode.currentEdge.target.index == this.kruskalData.edgeStep[this.step][0].target){
            //minEdge clicked
            d3.select("#infoText").html(kruskalTutorial.createMessage(8))
            this.next(this.nFail)
            //this.step += 1
            kruskalTutorial.updateSelection(true)
        }
        else{
        */
            //nothing should happen here, so restore edge to default
        if(kruskalMode.selection.length == this.graph.vertices.length -1) return
            //d3.select("#infoText").html(kruskalTutorial.createMessage(7))
            let source = kruskalMode.nameMap.nameMap[kruskalMode.currentEdge.source.name]
            let target = kruskalMode.nameMap.nameMap[kruskalMode.currentEdge.target.name]
            let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">${source}${target}</SPAN>`
            d3.select("#infoText").html(`${edge} is not a safe edge, try another edge!`)
            kruskalMode.ignore[kruskalMode.currentEdge.index] = false
            //kruskalMode.update()
            //Lock svg 
            //this.lock()
        //}
    },
    // chaining steps
        //start
    nFirstClick : function(){
        kruskalTutorial.unlock()
        d3.select("#infoText").html(kruskalTutorial.createMessage(1))
        kruskalTutorial.updateSelection()
    },
    nFirstUnion : function(){
        kruskalTutorial.unlock()
        d3.select("#infoText").html(kruskalTutorial.createMessage(2))
        kruskalTutorial.next(kruskalTutorial.nFirstUnionFind)
    },
    nFirstUnionFind : function(){
        kruskalTutorial.unlock()
        d3.select("#infoText").html(kruskalTutorial.createMessage(3))
        kruskalTutorial.next(kruskalTutorial.nExtract)
    },
        //main loop
    nExtract : function(){
        kruskalTutorial.step += 1
        kruskalTutorial.unlock()
        d3.select("#infoText").html(kruskalTutorial.createMessage(4))
        kruskalTutorial.updateSelection()
        
    },
    nSuccess : function(){
        kruskalTutorial.unlock()
        d3.select("#infoText").html(kruskalTutorial.createMessage(5))
        kruskalTutorial.next(kruskalTutorial.nExtract)
    },
    nFail : function(){
        kruskalTutorial.unlock()
        d3.select("#infoText").html(kruskalTutorial.createMessage(6))
        if(kruskalTutorial.step == kruskalTutorial.kruskalData.edgeStep.length-2){
            kruskalTutorial.step += 1
            kruskalTutorial.next(kruskalTutorial.nFinish)
            return
        }
        kruskalTutorial.next(kruskalTutorial.nExtract)
    },
    nFinish : function(){
        kruskalTutorial.unlock()
        d3.select("#infoText").html("Finish, all edges checked!")
        kruskalTutorial.next(kruskalTutorial.nQuit)
        d3.select(".confirmText").html("Quit")
        kruskalTutorial.updateSelection()
    },
    nQuit : function(){
        kruskalTutorial.unlock()
        sceneManager.enterQueue(mainMenu)
        sceneManager.nextScene()
    },

    //update sorted edges in div tag with id #selection
    updateSelection : function(extracted,firstInsert){
        let content = "Sorted Array<br>"
        let e = extracted
        if(kruskalTutorial.kruskalData.edgeStep[kruskalTutorial.step].length == 0){
            content += "[Empty]"
        }
        else{
            content += "Min "
        }
        for(let i = 0; i <kruskalTutorial.kruskalData.edgeStep[kruskalTutorial.step].length; i++){
            if(e == true){
                i += 1
                e = false
                content += `[0] Extracted<br><br>`
            }


            let source = kruskalMode.nameMap.nameMap[kruskalTutorial.kruskalData.edgeStep[kruskalTutorial.step][i].source]
            let target = kruskalMode.nameMap.nameMap[kruskalTutorial.kruskalData.edgeStep[kruskalTutorial.step][i].target]
            content += `[${i}]<SPAN STYLE="text-decoration:overline; font-weight:bold">
            ${source}${target}
            </SPAN> w: ${kruskalTutorial.kruskalData.edgeStep[kruskalTutorial.step][i].key}<br><br>`
        }
        d3.select("#selection").html(content)
    },
    //messages
    createMessage : function(number){
        let s = kruskalMode.nameMap.nameMap[this.kruskalData.edgeStep[this.step][0].source]
        let t = kruskalMode.nameMap.nameMap[this.kruskalData.edgeStep[this.step][0].target]
        let source = `<SPAN STYLE="font-weight:bold">${s}</SPAN>`
        let target = `<SPAN STYLE="font-weight:bold">${t}</SPAN>`
        let minEdge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">
        ${s}${t}</SPAN>`
        switch(number){
            case 0:
                //starting message explain forest and tags
                return `Kruskal's algorithm tutorial. We start by having a forest containing all vertices, 
                with each vertex being in its own connected component, given a color and tag number as ID.`
            case 1:
                // explain edges selection order, request first click
                return `Then all edges will be sorted by weight in ascending order. Kruskal will now try to add the edges to the forest in this order. 
                Try to click on ${minEdge}.`
            case 2:
                // first union
                return `${source} and ${target} did not have the same Color(Tag), ${minEdge} has now been added to the forest! 
                ${source} and ${target} are now connected, they share the same Color(Tag) now!`
            case 3:
                // more explanation union find
                return `For short we call this operation Union(${source}, ${target}) and Find(${source}) = Tag(${source}) for finding the connected components.`
            case 4:
                // main loop extract
                return `Extract the minimum weight edge ${minEdge} from the array. Click on ${minEdge}.`
            case 5:
                // main loop success
                return `Find(${source}) != Find(${target}). Union(${source}, ${target}) success! ${minEdge} is now added to the forest!`
            case 6:
                // main loop fail
                return `Find(${source}) == Find(${target}). ${source} and ${target} share the same Tag, not added!`
            case 7:
                // click wrong edge
                return `You did NOT click on ${minEdge}! CLICK ON ${minEdge} to proceed!`
            case 8:
                // extraction
                return `Extracted ${minEdge}.` 
            case 9:
                return `Finish, all edges checked!`
            }
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