import * as Algo from '../algo.js';
import * as Vector from '../2dVector.js'
import * as Color from '../tools/colorGenerator.js'
import UnionFind from '../ds/unionFind.js';
import { customEvent } from '../events/customEvent.js';
import { nodeNameMap } from '../tools/nodeNameMap.js';
const undirectedMode = {
    ID : "undirected",
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
    nodeR1 : 28,
    nodeR2 : 32,
    nodeColor : "hsl(220.1251252363263,100%,50%)",//"#4845ff",
    nodeBorderWidth : 2,
    nodeBorderColor : "#e7e7e7",
    textSize : 15,
    tenseLinkColor : "#fc0000",
    relaxLinkSize : 0,
    relaxLinkColor : "#fff130",
    lineSelectedColor : "#fc0000",
    lineHoverColor : "white",//"#fc0000",
    lineUnhoverColor : "white",//"#fff130",
    lineUnhoverOpacity : 0.25,
    clickboxSize : 20,
    edgeTextOffset : 15,
    animationDuration : 300,
    ignore : [],
    selection : [],
    forest: undefined,
    svg : undefined,
    nameMap : undefined,
    freeze : false,
    setGraph : function(g){
        this.graph = g
        this.selection = []
        this.forest = new UnionFind(this.graph.vertices)
        this.nameMap = nodeNameMap
        this.nameMap.map(this.graph.vertices)
        this.ignore = []
        for(let i = 0; i<this.graph.edges.length;i++){
            this.ignore.push(false)
        }
    },

    denyInput : function(){
        this.freeze = true
    },

    allowInput : function(){
        this.freeze = false
    },

    reset : function(){
        this.selection = []
        this.forest.reset()
        for(let i = 0; i<this.ignore.length; i++){
            this.ignore[i] = false
        }
        this.update()
    },

    undo : function(){
        this.selection.pop()
        this.forest.undo()
        this.update()
    },

    lineHover : function(v,name){
        /*
        d3.selectAll("line.graphEdge."+name).filter(d=> v.index===d.index)
        //.transition().duration(animationDuration)
        .attr("stroke", this.lineHoverColor)//.classed("hover", true)
        d3.selectAll("line.graphEdge."+name).filter(d=> v.index!=d.index)
        //.transition().duration(animationDuration)
        .attr("opacity", this.lineUnhoverOpacity)//.classed("nonhover", true)
        */
        d3.selectAll("line.clickbox."+name).filter(d=> v.index===d.index)
        .attr("opacity", 0.5)
    },

    lineUnhover : function(name){
        
        d3.selectAll("line.graphEdge."+name)
        //.transition().duration(animationDuration)
        .attr("stroke", e=>{if(this.selection.indexOf(e) < 0){return this.lineUnhoverColor} else{return this.lineSelectedColor}})
        //.attr("opacity", 1)//.classed("hover", false).classed("nonhover", false)
        
        d3.selectAll("line.clickbox."+name)
        .attr("opacity", 0)
    },

    lineClick : function(v,name){
        d3
        .selectAll("line.graphEdge."+name)
        .filter(d=> v.index===d.index)
        .transition()
        .duration(this.animationDuration)
        .attr("stroke", d=>{
            if(this.selection.indexOf(d) < 0){
                if(!this.forest.union(d.source.name, d.target.name)){
                    //illegal edge selection click, would create cycle
                    if(!this.ignore[d.index]){
                        this.ignore[d.index] = true
                    }
                    document.dispatchEvent(customEvent.doNothing)
                    document.dispatchEvent(customEvent.illegalMove)
                    console.log("illegal")
                }
                else{
                    this.selection.push(d)
                    document.dispatchEvent(customEvent.legalMove)
                }
            }
            console.log(this.selection)
        })
        this.update()
    },

    update : function(){
        //line update
        d3.selectAll("line.graphEdge")
        .transition()
        .duration(this.animationDuration)
        .attr("stroke", e=>{if(this.selection.indexOf(e) < 0){return this.lineUnhoverColor} else{return this.lineSelectedColor}})
        .attr("opacity", e =>{
            if(this.ignore[e.index] && (this.forest.find(e.source.name) == this.forest.find(e.target.name))){
                return 0.25
            }
            else{
                this.ignore[e.index] = false
                return 1
            }
        })
        //nodetext update
        d3
        .selectAll("text.node")
        .text(d=> {
            return this.nameMap.nameMap[d.name]
        })
        //TODO?
        //edgeweight text update
        d3
        .selectAll("text.edge")
        .text(d=> d.key)
        .transition()
        .duration(this.animationDuration)
        .style("fill", e=>{if(this.selection.indexOf(e) < 0){return this.lineUnhoverColor} else{return this.lineSelectedColor}})
        .attr("opacity", e =>{
            if(this.ignore[e.index] && (this.forest.find(e.source.name) == this.forest.find(e.target.name))){
                return 0.25
            }
            else{
                this.ignore[e.index] = false
                return 1
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
        //TODO?
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
    //draw svg elements
    draw : async function(name,field,sim){
        this.link = field
        .selectAll("line.graphEdge."+name)
        .data(this.graph.edges)
        .enter()
        .append("line")
        .attr('class', 'graphEdge')
        .classed(name, true)
        .attr("stroke-width", d=> d.key)
        .attr("stroke", this.lineUnhoverColor)

        this.linkClickbox = field
        .selectAll("line.clickbox."+name)
        .data(this.graph.edges)
        .enter()
        .append("line")
        .attr('class', 'clickbox')
        .classed(name, true)
        .attr("stroke-width", this.clickboxSize)
        .attr("stroke", this.lineUnhoverColor)
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
        .style("font-family", "Comic Sans MS")
        .style("font-size", this.textSize)
        .style("font-weight", "bold")
        .style("fill", "black")
        // TODO?
        this.edgeText = field
        .selectAll("text.edge."+name)
        .data(this.graph.edges)
        .enter()
        .append("text")
        .classed("edge", true)
        .classed(name,true)
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("font-family", "Comic Sans MS")
        .style("font-size", this.textSize)
        .style("font-weight", "bold")
    },
    //initiate simulation
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
        this.sim1 = sim
        
        this.draw(name,field,sim);
        //hide on load
        this.update()
    }

}

export {undirectedMode}