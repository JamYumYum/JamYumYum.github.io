import * as Algo from '../algo.js';
import * as Vector from '../2dVector.js'
import { customEvent } from '../events/customEvent.js';
const primMode = {
    ID : "prim",
    graph : undefined,
    link : undefined,
    node : undefined,
    nodeText : undefined,
    edgeText : undefined,
    linkClickbox : undefined,
    tenseLink : undefined,
    linkDirection : undefined,
    primData : undefined,
    kruskalData : undefined,
    dijkstraData : undefined,
    svg1 : undefined,
    svg2 : undefined,
    sim1 : undefined,
    sim2 : undefined,
    width : 1200,
    height : 700,
    nodeR1 : 20,
    nodeR2 : 24,
    nodeColor : "white",
    nodeSelectedColor : "#4845ff",
    nodeBorderWidth : 4,
    nodeBorderColor : "#e7e7e7",
    textSize : 15,
    lineSelectedColor : "#fc0000",
    lineNotSelectedColor : "white",
    lineHoverColor : "#fc0000",
    lineUnhoverColor : "#fff130",
    safeEdgeColor : "#fff130",
    lineUnhoverOpacity : 0.25,
    clickboxSize : 15,
    edgeTextOffset : 15,
    animationDuration : 300,
    edgeSelection : [],
    directG : true,
    selection : [],
    startVertex : 0,
    selectedSet : [],
    svg : undefined,
    freeze : false,
    setGraph : function(g){
        this.graph = g
        this.selection = []
        this.selectedSet = [this.startVertex]
    },

    denyInput : function(){
        this.freeze = true
    },

    allowInput : function(){
        this.freeze = false
    },

    reset : function(){
        this.selection = []
        this.selectedSet = [this.startVertex]
        this.update()
    },

    undo : function(){
        if(this.selection.length != 0){
            this.selection.pop()
            this.selectedSet.pop()
            this.update()
        }
    },

    lineHover : function(v,name){
        //TODO
    },

    lineUnhover : function(name){
        //TODO
    },
    goodMove : function(){
        //TODO good move, if selected edge is a safe edge and has min weight
        let recentEdge = this.selection[this.selection.length-1]
        let setState = this.selectedSet.slice()
        setState.pop()
        for(let i = 0; i< this.graph.edges.length;i++){
            let edge = this.graph.edges[i]
            if(( (setState.indexOf(edge.source.name) < 0) || (setState.indexOf(edge.target.name) < 0) )
            && (!(setState.indexOf(edge.source.name) < 0) || !(setState.indexOf(edge.target.name) < 0))){
                    //safe edge
                    if(edge.key < recentEdge.key){
                        return false
                    }
            }
        }
        return true
    },
    lineClick : function(v,name){
        d3.selectAll("line.graphEdge."+name)
        .filter(d=> v.index===d.index)
        .attr("stroke", e=>{
            if(( (this.selectedSet.indexOf(e.source.name) < 0) || (this.selectedSet.indexOf(e.target.name) < 0) )
                && (!(this.selectedSet.indexOf(e.source.name) < 0) || !(this.selectedSet.indexOf(e.target.name) < 0))){
                //source xor target in selectedSet
                this.selection.push(e)
                if(this.selectedSet.indexOf(e.source.name) < 0){
                    this.selectedSet.push(e.source.name)
                }
                else{
                    this.selectedSet.push(e.target.name)
                }
                document.dispatchEvent(customEvent.legalMove)
            }
        })
        this.update()
        document.dispatchEvent(customEvent.edgeClicked)
    },

    update : function(){
        //line Update
        d3.selectAll("line.graphEdge")
        .transition()
        .duration(this.animationDuration)
        .attr("stroke", e=>{
            if(!(this.selection.indexOf(e) < 0)){
                //selected edge
                return this.lineSelectedColor
            }
            else{
                if(( (this.selectedSet.indexOf(e.source.name) < 0) || (this.selectedSet.indexOf(e.target.name) < 0) )
                && (!(this.selectedSet.indexOf(e.source.name) < 0) || !(this.selectedSet.indexOf(e.target.name) < 0))){
                    //source xor target in selectedSet
                    return this.safeEdgeColor
                }
                else{
                    return this.lineNotSelectedColor
                }
            }
        })
        //edge weight text update
        d3
        .selectAll("text.edge")
        .text(d=> d.key)
        .transition()
        .duration(this.animationDuration)
        .style("fill", e=>{
            if((this.selectedSet.indexOf(e.source.name) < 0) && (this.selectedSet.indexOf(e.target.name) < 0)){
                //source and target in S
                if(this.selection.indexOf(e) < 0){
                    return this.lineNotSelectedColor
                }
                else{
                    return this.lineSelectedColor
                }
            }
            if(!(this.selectedSet.indexOf(e.source.name) < 0) && !(this.selectedSet.indexOf(e.target.name) < 0)){
                //source and target not in S
                if(this.selection.indexOf(e) < 0){
                    return this.lineNotSelectedColor
                }
                else{
                    return this.lineSelectedColor
                }
            }
            else{
                //source xor target in S
                return this.safeEdgeColor
            }
        })
        //nodeColor
        d3
        .selectAll("circle.graphNode")
        .transition()
        .duration(this.animationDuration)
        .attr("fill", v=>{
            if(this.selectedSet.indexOf(v.name) < 0){
                //Node not in S
                return this.nodeColor
            }
            else{
                return this.nodeSelectedColor
            }
        })
    },

    posCalc : function(){
        //node position
        d3.selectAll('circle.graphNode')
        .attr('cx', v => v.x)
        .attr('cy', v => v.y)
        //line position
        d3.selectAll('line.graphEdge, line.clickbox')
        .attr('x1', e => e.source.x)
        .attr('y1', e => e.source.y)
        .attr('x2', e => e.target.x)
        .attr('y2', e => e.target.y)
        //node text position
        d3.selectAll('text.node')
        .attr('x', v => v.x)
        .attr('y', v => v.y + this.textSize/4)
        //edge text position
        d3.selectAll("text.edge")
        .attr("x", e => {
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
            return e.source.x + (e.target.x - e.source.x)/2 + nOrthogonal[0]*(this.edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(this.textSize/4))
        })
        .attr("y", e => {
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
            return e.source.y + (e.target.y - e.source.y)/2 + nOrthogonal[1]*(this.edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(this.textSize/4))
        })
    },

    draw : async function(name,field,sim){
        this.link = field
        .selectAll("line.graphEdge."+name)
        .data(this.graph.edges)
        .enter()
        .append("line")
        .attr('class', 'graphEdge')
        .classed(name, true)
        .attr("stroke-width", d=> d.key)
        .attr("stroke", this.lineNotSelectedColor)

        this.linkClickbox = field
        .selectAll("line.clickbox."+name)
        .data(this.graph.edges)
        .enter()
        .append("line")
        .attr('class', 'clickbox')
        .classed(name, true)
        .attr("stroke-width", this.clickboxSize)
        .attr("stroke", this.lineNotSelectedColor)
        .attr("opacity", 0)
        .on("mouseover", v => {if(!this.freeze){return this.lineHover(v,name)}})
        .on("mouseout", () => {if(!this.freeze){return this.lineUnhover(name)}})
        .on("mousedown", v => {if(!this.freeze){return this.lineClick(v,name)}})
        
        this.node = field
        .selectAll("circle.graphNode."+name)
        .data(this.graph.vertices)
        .enter()
        .append("circle")
        .attr('class', 'graphNode')
        .classed(name,true)
        .attr("r", d=> this.nodeR1)
        .attr("fill", this.nodeColor)
        .attr("stroke-width", this.nodeBorderWidth)
        .attr("stroke", this.nodeBorderColor)
        .on("mouseover", v=>{
            d3
            .selectAll("circle.graphNode."+name)
            .filter(d=> v.index === d.index)
            .classed("hover", true)
            .transition()
            .duration(this.animationDuration)
            .attr("r", this.nodeR2)
        })
        .on("mouseout", v=>{
            d3
            .selectAll("circle.graphNode."+name)
            .filter(d=> v.index === d.index)
            .classed("hover", false)
            .transition()
            .duration(this.animationDuration)
            .attr("r", this.nodeR1)
            })
        .call(
            d3
            .drag()
            .on("start", v=>{
                if (!d3.event.active) sim.alphaTarget(0.3).restart();
                v.fx = v.x;
                v.fy = v.y;
            })
            .on("drag", v=>{
                v.fx = d3.event.x;
                v.fy = d3.event.y;
            })
            .on("end", v=>{
                if (!d3.event.active) sim.alphaTarget(0);
                v.fx = null;
                v.fy = null;
            })
        )
        //node Text field
        this.nodeText = field
        .selectAll("text.node."+name)
        .data(this.graph.vertices)
        .enter()
        .append("text")
        .classed("node", true)
        .classed(name,true)
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("font-family", "arial")
        .style("font-size", this.textSize)
        .style("font-weight", "bold")
        .style("fill", "black")
        //edge weight text
        this.edgeText = field
        .selectAll("text.edge."+name)
        .data(this.graph.edges)
        .enter()
        .append("text")
        .classed("edge", true)
        .classed(name,true)
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("font-family", "arial")
        .style("font-size", this.textSize)
        .style("font-weight", "bold")
    },

    initiateSimulation : async function(name, field,sim){
        this.svg = name
        d3
        .select("body")
            .append("svg")
            .attr("class", name)
            .attr("width", this.width)
            .attr("height", this.height);
            
        field = d3.select("svg."+name);
        sim = d3.forceSimulation(this.graph.vertices)
            //.force("link", d3.forceLink(graph.edges).distance(100).strength(2))
            .force("link", d3.forceLink(this.graph.edges).distance(50).strength(0.9))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(this.width/2,this.height/2))
            .force('collide', d3.forceCollide(50).iterations(6))
            .on('tick', () => {
                this.posCalc()
        })
        ;
        this.draw(name,field,sim);
        //hide on load
        this.update()
    }
}



export {primMode}