const svg12UI = {
    drawUI : function(directed, dijkstra){
        let grid = d3.select("body")
                        .append("div")
                        .attr("id", "grid3")
        grid.append("div").attr("id", "svg1")
        grid.append("div").attr("id", "svg2")
        grid.append("div").attr("id","infoText2")
        grid.append("div").attr("id","command2")
        grid.append("div").attr("id","total2")

    },
    updateUIcontent : function(){

    },
    cleanupUI : function(){
        d3.select("#grid3").remove()
    },
}

export {svg12UI}