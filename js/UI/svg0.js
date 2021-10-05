import { customEvent } from "../events/customEvent.js"
const svg0UI = {
    drawUI : function(mode){
        let grid = d3.select("body")
                        .append("div")
                        .attr("id", "grid1")
        grid.append("div").attr("id", "svg0")
        grid.append("div").attr("id","infoText")
        grid.append("div").attr("id","total")
        grid.append("div").attr("id","selection")
        grid.append("div").attr("id","command")
        d3.select("body").append("div").classed("lock", true)

        //get current grid item size for svg
        let element = document.getElementById("svg0")
        let style = window.getComputedStyle(element)
        mode.width = parseInt(style.getPropertyValue("width"))
        mode.height = parseInt(style.getPropertyValue("height"))

        d3.select(".lock").on("mousedown", v=>{
            console.log("unlock")
            d3.select(".lock").remove()
        })
    },
    updateUIcontent : function(){

    },
    cleanupUI : function(){
        d3.select("#grid1").remove()
        d3.select("#lock").remove()
    },
}

export {svg0UI}