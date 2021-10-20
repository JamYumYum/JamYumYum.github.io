import { primMode } from "../../modus/primMode.js"
import * as G from '../../tools/graphGenerator.js';
import * as A from '../../tools/algo.js'
import { svg0UI } from "../../UI/svg0.js";
import { mainMenu } from "../mainMenu.js";
import { sceneManager } from "../sceneManager.js";

const primTutorial = {
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
        this.mode = primMode
        svg0UI.drawUI(this.mode)
        this.graph = G.tutorialGraph() 
        this.algoGraph = G.copyGraph(this.graph)
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(this.name1,this.svg1,this.sim1)
        this.step = 0
        this.selectedStartVertex = false

        document.addEventListener("legalMove", primTutorial.nAddEdge)
        document.addEventListener("illegalMove", primTutorial.nIgnore)
        document.addEventListener("doNothing", primTutorial.nIgnore2)
        document.addEventListener("nodeClicked", primTutorial.nNodeClicked)
        document.addEventListener("keydown", primTutorial.nlogKey)
        window.addEventListener("resize", this.nrecenter)
        
        this.initMessages()
        d3.select("#infoText").html(this.messages[0])
        this.updateCommand()
        this.updateInfo()
    },
    nlogKey : function(e){
        primTutorial.logKey(e)
    },
    logKey : function(e){
        switch(e.code){
            case "Escape":
                sceneManager.enterQueue(mainMenu)
                sceneManager.nextScene()
                break
        }    
    },
    reset(){
        this.mode.reset()
        this.totalWeight = 0
        this.step = 0
        if(this.mode.ID == "prim"){
            d3.select("#infoText").html("Select a starting vertex!")
        }
        else{
            d3.select("#infoText").html("Initial state.")
        }
        this.updateTotal()
        //this.updateSelection()
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
        primTutorial.mode.recenter()
    },
    exit : function(){
        this.cleanup()
        svg0UI.cleanupUI()
        this.unlock()
        document.removeEventListener("legalMove", primTutorial.nAddEdge)
        document.removeEventListener("illegalMove", primTutorial.nIgnore)
        document.removeEventListener("doNothing", primTutorial.nIgnore2)
        document.removeEventListener("nodeClicked", primTutorial.nNodeClicked)
        document.removeEventListener("keydown", primTutorial.nlogKey)
        window.removeEventListener("resize", this.nrecenter)
    },
    nNodeClicked : function(){
        primTutorial.primData = A.prim(primTutorial.algoGraph, primMode.startVertex)
        //d3.select("#infoText").html(primTutorial.createMessage(1))
        console.log(primTutorial.primData)
        //primTutorial.updateSelection()
        //primTutorial.next(primTutorial.nSafeEdgesMessage)

        d3.select("#infoText").html("Prim will now start the main loop, click on a safe edge!")
    },
    nAddEdge : function(){
        primTutorial.addEdge()
    },
    // actions if edge was clicked
    addEdge : function(){
        //console.log(this.primData.pQueueStep[this.step][1])
        //console.log(primMode.selection[primMode.selection.length-1])
        let source = primMode.nameMap.nameMap[primMode.currentEdge.source.name]
        let target = primMode.nameMap.nameMap[primMode.currentEdge.target.name]
        let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">${source}${target}</SPAN>`
        if(primMode.goodMove()){
            // minEdge clicked
            /*
            if(this.step == 0){
                d3.select("#infoText").html(primTutorial.createMessage(4))
                // update pQueue display
                this.updateSelection(true, true)
                this.next(primTutorial.nAddNeighbours, true)
            }
            else{
                d3.select("#infoText").html(primTutorial.createMessage(7))
                // update pQueue display
                this.updateSelection(true)
                this.next(primTutorial.nAddNeighbours, false)
            }
            */
            d3.select("#infoText").html(`${edge} is a safe edge! Select the next safe edge!`)
            //this.updateSelection(true)
            this.step += 1
            if(primMode.selection.length == this.graph.vertices.length -1){
                d3.select("#infoText").html(`${edge} is a safe edge! Every vertex is now connected and you have built a MST, Prim is now done! Press [Esc] to return to the main menu.`)

            }
        }
        else{
            //nothing should happen here, so restore edge to default, rquest to click on minEDge
            //d3.select("#infoText").html(primTutorial.createMessage(10))
            d3.select("#infoText").html(`${edge} wouldn't create a cycle, but it is not the edge Prim is looking for!`)
            primMode.undo()
            //Lock svg 
            //this.lock()
        }
    },
    nIgnore : function(){
        primTutorial.ignore()
    },
    ignore : function(){
        console.log(this.primData.pQueueStep[this.step][1])
        console.log(primMode.selection[primMode.selection.length-1])

        /*
        if(primMode.currentEdge.source.name == this.primData.pQueueStep[this.step][1].source
            && primMode.currentEdge.target.name == this.primData.pQueueStep[this.step][1].target){
            // minEdge clicked
            console.log("reach")
            d3.select("#infoText").html(this.createMessage(8))
            //update pQueue display
            this.updateSelection(true)
            this.next(primTutorial.nAddNeighbours, false)
            this.step += 1
            
        }
        */
        //else{
            //nothing should happen here, so restore edge to default
            //d3.select("#infoText").html(this.createMessage(10))
        if(primMode.selection.length == this.graph.vertices.length -1) return
        let source = primMode.nameMap.nameMap[primMode.currentEdge.source.name]
        let target = primMode.nameMap.nameMap[primMode.currentEdge.target.name]
        let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">${source}${target}</SPAN>`
        d3.select("#infoText").html(`${edge} is not a safe edge, try another edge!`)
        primMode.ignore[primMode.currentEdge.index] = false
            //primMode.update()
            //Lock svg 
            //this.lock()
        //}
    },
    nIgnore2 : function(){
        primTutorial.ignore2()
    },
    ignore2 : function(){
        //Lock svg 
        //this.lock()
        //d3.select("#infoText").html(this.createMessage(10))
        let source = primMode.nameMap.nameMap[primMode.currentEdge.source.name]
        let target = primMode.nameMap.nameMap[primMode.currentEdge.target.name]
        let edge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">${source}${target}</SPAN>`
        d3.select("#infoText").html(`${edge} is undecided, we don't know if it is safe!`)
    },

    //chaining steps after adding minEdge, showing priority queue content
    nAddNeighbours : function(firstTime){
        primTutorial.unlock()
        // check if done
        if(primTutorial.primData.pQueueStep.length-2 < primTutorial.step){
            d3.select("#infoText").html("Finish! Priority queue empty!")
            //this.updateSelection()
            //Lock svg 
            primTutorial.next(primTutorial.nQuit)
            d3.select(".confirmText").html("Quit")
            return
        }
        //not done continue loop
        if(firstTime){
            d3.select("#infoText").html(primTutorial.createMessage(2))
        }
        else{
            d3.select("#infoText").html(primTutorial.createMessage(5))
        }
        // update pQueue display
        primTutorial.updateSelection()
        primTutorial.next(primTutorial.nExtractNext)
    },
    nExtractNext : function(){
        //request next Click on minedge
        primTutorial.unlock()
        d3.select("#infoText").html(primTutorial.createMessage(6))
    },

    //chain after initial startvertex selection
    nSafeEdgesMessage : function(){
        primTutorial.unlock()
        d3.select("#infoText").html(primTutorial.createMessage(9))
        primTutorial.updateSelection(false,true)
        primTutorial.next(primTutorial.nFirstExtract)
    },
    nFirstExtract : function(){
        d3.select("#infoText").html(primTutorial.createMessage(3))
        primTutorial.unlock()
    },
    nQuit : function(){
        primTutorial.unlock()
        sceneManager.enterQueue(mainMenu)
        sceneManager.nextScene()
    },
    //total update
    updateTotal : function(){
        d3.select("#total").html(`Total weight<br>${this.totalWeight}`)
    },
    //update pQueue in div tag with id #selection
    updateSelection : function(extracted,firstInsert){
        console.log("reach")
        let content = "Priority Queue<br>"
        

        if(primTutorial.step != 0){
            // main loop
            content += "Min "
            let e = extracted
            for(let i = 1; i < primTutorial.primData.pQueueStep[primTutorial.step].length; i++){
                if(e == true){
                    i += 1
                    e = false
                    console.log("flag")
                    content = content + `[1] Extracted<br><br>`
                }

                if(primTutorial.primData.pQueueStep[primTutorial.step].length == i){
                    content ="Priority Queue<br>[Empty]"
                    break
                }
                let source = primMode.nameMap.nameMap[primTutorial.primData.pQueueStep[primTutorial.step][i].source]
                let target = primMode.nameMap.nameMap[primTutorial.primData.pQueueStep[primTutorial.step][i].target]
                content = content+ `[${i}]<SPAN STYLE="text-decoration:overline; font-weight:bold">
                ${source}${target}
                </SPAN> w: ${primTutorial.primData.pQueueStep[primTutorial.step][i].key}<br><br>`
            }
        }
        else{
            // starting
            if(firstInsert == true){
                content += "Min "
                let e = extracted
                for(let i = 1; i < primTutorial.primData.pQueueStep[0].length; i++){
                    if(e == true){
                        i += 1
                        e = false
                        console.log("flag")
                        content = content + `[1] Extracted<br><br>`
                    }
                    let source = primMode.nameMap.nameMap[primTutorial.primData.pQueueStep[primTutorial.step][i].source]
                    let target = primMode.nameMap.nameMap[primTutorial.primData.pQueueStep[primTutorial.step][i].target]
                    content = content+ `[${i}]<SPAN STYLE="text-decoration:overline; font-weight:bold">
                    ${source}${target}
                    </SPAN> w: ${primTutorial.primData.pQueueStep[primTutorial.step][i].key}<br><br>`
                }
            }
            else{
                content += "[Empty]"
            }
        }
        d3.select("#selection").html(content)
    },
    //messages
    initMessages : function(){
        // starting message, select starting vertex more if necessary
        this.messages[0] = "Prim's algorithm tutorial. Start by Selecting a Vertex. Click on any one."
        
    },
    createMessage : function(number){
        let source
        let target
        let minEdge
        source =primMode.nameMap.nameMap[this.primData.pQueueStep[this.step][1].source]
        target =primMode.nameMap.nameMap[this.primData.pQueueStep[this.step][1].target]
        
        // Create string of all new edges added to pQueue
        let newEdges = []
        let newEdgesString = ""
        let have = "have"
        if(this.step > 0){
            for(let i = 0; i< this.primData.pQueueStep[this.step].length;i++){
                if(this.primData.pQueueStep[this.step-1].indexOf(this.primData.pQueueStep[this.step][i])<0){
                    newEdges.push(this.primData.pQueueStep[this.step][i])
                }
            }
            for(let i = 0; i< newEdges.length; i++){
                let s = primMode.nameMap.nameMap[newEdges[i].source]
                let t = primMode.nameMap.nameMap[newEdges[i].target]
                newEdgesString += `<SPAN STYLE="text-decoration:overline; font-weight:bold">
                ${s}${t}</SPAN>`
                if(i!=newEdges.length-1){
                    newEdgesString += ", "
                }
            }
            if(newEdges.length < 2){
                if(newEdges.length == 0){
                    newEdgesString = "Nothing"
                }
                have = "has"
            }
        }

        minEdge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">
                   ${source}${target}</SPAN>`
        switch (number) {
            case 0:
                //ALLOW INTERACTION starting message, select starting vertex
                return "Prim's algorithm tutorial. Start by Selecting a Vertex. Click on any one."
            case 1:
                //DENY INTERACTION vertex selected
                return `You have selected <SPAN STYLE="font-weight:bold">
                ${primMode.nameMap.nameMap[primMode.startVertex]} </SPAN>as 
                starting Vertex. It will now be added to your tree (blue).`
            case 2:
                // adding initial edges to pqueue
                console.log(newEdges)
                return `${newEdgesString} ${have} been added to the priority queue.`
            case 3:
                //ALLOW INTERACTION extract first minEdge, request click
                //this.primData.pQueueStep[this.step - 1][1]
                source =primMode.nameMap.nameMap[this.primData.pQueueStep[0][1].source]
                target =primMode.nameMap.nameMap[this.primData.pQueueStep[0][1].target]
                minEdge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">
                ${source}${target}</SPAN>`
                return `Prim will now start the main loop. Extract the minimum weight edge ${minEdge} from the priority queue. 
                Now try to click on ${minEdge}.`
            case 4:
                //DENY INTERACTION added min edge to tree
                source =primMode.nameMap.nameMap[this.primData.pQueueStep[0][1].source]
                target =primMode.nameMap.nameMap[this.primData.pQueueStep[0][1].target]
                minEdge = `<SPAN STYLE="text-decoration:overline; font-weight:bold">
                ${source}${target}</SPAN>`

                return `${minEdge} does not connect two vertices in the tree, so ${minEdge} will 
                be added to the tree(turning red). The new neighbouring vertex will also be added and turn blue.`
            case 5:
                //insert neighbouring edges to pQueue
                return `${newEdgesString} ${have} been added to the priority queue.`
            case 6:
                //ALLOW INTERACTION loop start extract minEDge request click
                return `Extract the minimum weight edge ${minEdge} from the priority queue. 
                Click on ${minEdge}.`
            case 7:
                //DENY INTERACTION added min edge to tree
                return `Extracting ${minEdge}. ${minEdge} is a safe edge, added to the tree.`
            case 8:
                // DENY INTERACTION min EDGE not safe
                return `Extracting ${minEdge}. ${minEdge} is NOT a safe edge, not added.`
            case 9 :
                return `The new yellow edges are safe edges, which means adding these edges 
                to the tree wont create a cycle. All edges connected to <SPAN STYLE="font-weight:bold">
                ${primMode.nameMap.nameMap[primMode.startVertex]} </SPAN> will be inserted into the priority queue.`
            case 10:
                //DENY INTERACTION clicked not on minEdge
                return `You did NOT click on ${minEdge}! CLICK ON ${minEdge} to proceed!`
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
        let content = `<SPANN STYLE="font-weight:bold">Prims algorithm tutorial</SPANN><br><br>
        Prim is building a MST by adding safe edges to an empty forest. 
        <br>
        <br>
        Prim starts by selecting a startvertex and adding it to a set S, 
        <br>
        <br>
        any edge with exactly one vertex in S can be added to the forest without creating a cycle, 
        if such an edge is also the least heavy edge among those edges, it is called a 
        <SPANN STYLE="font-weight:bold">safe edge</SPANN>. 
        <br>
        <br>
        Adding a safe edge to the forest also adds the new vertex to S. 
        <br>
        <br>
        Prim will continuously add safe edges.
        <br>
        <br>
        Prim is done, if all vertices are in S.`
        d3.select("#tutorialInfo").html(content)
    }
}

export {primTutorial}