import { customEvent } from "../events/customEvent.js"
const svg0UI = {
    drawUI : function(mode){
        let grid = d3.select("body")
                        .append("div")
                        .attr("id", "grid1")
        grid.append("div").attr("id", "svg0")
        grid.append("div").attr("id","infoText")
        grid.append("div").attr("id","inspector")
        grid.append("div").attr("id","state")
        grid.append("div").attr("id","command")
        grid.append("div").attr("id","mode")
        grid.append("div").attr("id","extra")

        //get current grid item size for svg
        let element = document.getElementById("svg0")
        let style = window.getComputedStyle(element)
        mode.width = parseInt(style.getPropertyValue("width"))
        mode.height = parseInt(style.getPropertyValue("height"))

    },
    updateUIcontent : function(){

    },
    cleanupUI : function(){
        d3.select("#grid1").remove()
    },
}

export {svg0UI}