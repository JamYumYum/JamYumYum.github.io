import { directedMode } from "../../modus/directedMode.js";
import * as A from '../../algo.js';
import * as G from '../../graphGenerator.js';
import { sceneManager } from "../sceneManager.js";
import { mainMenu } from "../mainMenu.js";
import { svg0UI } from "../../UI/svg0.js";

const fordTutorial = {
    mode : undefined,   //used mode
    graph1 : undefined, //graph
    svg1 : undefined, // svg element 
    sim1 : undefined, // simulation
    name1 : "svg0", // id for grid item and class name for svg
    totalRelaxations : 0, // counter for edge relaxations
    start : function(){
        //TODO
    },
    nlogKey : function(e){
        fordTutorial.logKey(e)
    },
    logKey : function(e){
        switch(e.code){
            case "Escape":
                sceneManager.enterQueue(mainMenu)
                sceneManager.nextScene()
                break
        }    
    },
    cleanup : function(){
        d3.selectAll("svg."+this.name1)
        .remove()
    },
    nrecenter : function(){
        fordTutorial.mode.recenter()
    },

    exit : function(){
        //TODO
    },
    // on relax actions here

    // chaining steps

    //update sorted edges in div tag with id #selection
    updateSelection : function(extracted,firstInsert){

    },
    //messages
    createMessage : function(number){
        
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
    }
}

export {fordTutorial}