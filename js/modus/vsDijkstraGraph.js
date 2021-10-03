import * as G from '../graphGenerator.js';
import * as A from '../algo.js'
import * as Vector from '../2dVector.js'
import SsspHelp from '../ds/ssspHelp.js';
import { nodeNameMap } from '../tools/nodeNameMap.js';
const vsDijkstraGraph = {
    graph : undefined,
    link : undefined,
    node : undefined,
    nodeName : undefined,
    nodeText : undefined,
    edgeText : undefined,
    linkClickbox : undefined,
    tenseLink : undefined,
    linkDirection : undefined,
    dijkstraData : undefined,
    svg1 : undefined,
    svg2 : undefined,
    sim1 : undefined,
    sim2 : undefined,
    width : 1200,
    height : 700,
    nodeR1 : 28,
    nodeR2 : 32,
    nodeColor : "#4845ff",
    nodeBorderWidth : 2,
    nodeBorderColor : "#e7e7e7",
    arrowSize : 20,
    tenseLinkSize : 10,
    textSize : 15,
    tenseLinkColor : "#fc0000",
    relaxLinkSize : 0,
    relaxLinkColor : "#fff130",
    notSelectedColor : "white",
    lineSelectedColor : "#fc0000",
    lineHoverColor : "#fc0000",
    lineUnhoverColor : "#fff130",
    lineUnhoverOpacity : 0.25,
    clickboxSize : 15,
    edgeTextOffset : 15,
    animationDuration : 300,
    startup : true,
    selection : [],
    ssspHelp : undefined,
    svg : undefined,
    totalTenseEdges : 0,
    minWeight : undefined,
    maxWeight : undefined,
    nameMap : undefined,
    freeze : false,
    setGraph : function(g){
        this.graph = g
        this.startup = true
        this.ssspHelp = new SsspHelp(this.graph)
        this.dijkstraData = A.dijkstra(this.graph, 0)
        this.minWeight = this.graph.edges[0].key
        this.maxWeight = this.graph.edges[0].key
        for(let i = 0; i < this.graph.edges.length; i++){
            if(this.minWeight>this.graph.edges[i].key){
                this.minWeight = this.graph.edges[i].key
            }
            if(this.maxWeight<this.graph.edges[i].key){
                this.maxWeight = this.graph.edges[i].key
            }
        }
        this.nameMap = nodeNameMap
        this.nameMap.map(this.graph.vertices)
    },

    setSvg : function(s1,s2){
        this.svg1 = s1
        this.svg2 = s2
    },

    setSim : function(s1,s2){
        this.sim1 = s1
        this.sim2 = s2
    },

    denyInput : function(){
        this.freeze = true
    },

    allowInput : function(){
        this.freeze = false
    },

    reset : function(){
        this.selection = []
        this.ssspHelp.reset()
        this.update()
    },

    undo : function(){
        this.selection.pop()
        this.ssspHelp.undo()
        this.update()
    },

    cleanup : function(){
        d3.selectAll("svg."+this.svg)
        .remove()
    },

    lineHover : function(v,name){
        //TODO
    },

    lineUnhover : function(name){
        //TODO
    },

    lineClick : function(v,name){
        //TODO
    },
    dijkstraClick : function(step){
        d3.selectAll("ellipse."+vsDijkstraGraph.svg)
        .filter(d => d.index === vsDijkstraGraph.dijkstraData.edgeSelection[step].index)
        .each( d => vsDijkstraGraph.ellipseClick(d, vsDijkstraGraph.svg,vsDijkstraGraph.sim1))
    },
    ellipseClick : function(v,name,sim){
        this.selection.push(v)
        if (!d3.event.active) sim.alphaTarget(0).stop();
        //Algo.relax(v)
        this.ssspHelp.relax(v)
        this.update()
        setTimeout(()=>{sim.alphaTarget(0).restart()},this.animationDuration)
        //successfully relaxed
    },

    update : function(){
        //line update
        this.totalTenseEdges = 0
        d3.selectAll("line.graphEdge."+this.svg)
        .attr("stroke", e=>{
            if(this.ssspHelp.tense(e)){
                this.totalTenseEdges += 1
                return this.tenseLinkColor
            }
            else{
                if(this.ssspHelp.predecessor[e.target.name] === e.source.name){
                    return this.relaxLinkColor
                }
                else{ 
                return this.notSelectedColor
                }
            }
        })
        //ellipse update
        d3.selectAll("ellipse."+this.svg)
        .attr("pointer-event", e=>{if(this.ssspHelp.tense(e)){return "auto"}else{return "none"}})
        .transition()
        .duration(this.animationDuration)
        .attr("ry", e=>{if(this.ssspHelp.tense(e)){return this.tenseLinkSize}else{return this.relaxLinkSize}})
        .attr("fill", e=>{if(this.ssspHelp.tense(e)){return this.tenseLinkColor}else{return this.relaxLinkColor}})
        //polygon update
        d3.selectAll("polygon."+this.svg)
        .transition()
        .duration(this.animationDuration)
        .attr("fill", e=>{
            if(this.ssspHelp.tense(e)){
                return this.tenseLinkColor
            }
            else{
                if(this.ssspHelp.predecessor[e.target.name] === e.source.name){
                    return this.relaxLinkColor
                }
                else{ 
                return this.notSelectedColor
                }
            }
        })
        //nodename update
        d3
        .selectAll("text.name."+this.svg)
        .text(d=> this.nameMap.nameMap[d.name])
        //nodetext update
        d3
        .selectAll("text.node."+this.svg)
        .text(d=> "["+this.ssspHelp.distance[d.name]+"]")
        //edgeweight text update
        d3
        .selectAll("text.edge."+this.svg)
        .text(d=> d.key)
        .transition()
        .duration(this.animationDuration)
        .style("fill", e=>{if(this.ssspHelp.tense(e)){return "red"}else{return "white"}})
        .attr("x",)
        .attr("y",)
        .attr("x", e => {
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
            let tenseOffset = this.ssspHelp.tense(e) ? this.tenseLinkSize-2 : 0;
            return e.source.x + (e.target.x - e.source.x)/2 + nOrthogonal[0]*(this.edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(this.textSize/4)+ tenseOffset)
        })
        .attr("y", e => {
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
            let tenseOffset = this.ssspHelp.tense(e) ? this.tenseLinkSize-2 : 0;
            return e.source.y + (e.target.y - e.source.y)/2 + nOrthogonal[1]*(this.edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(this.textSize/4)+ tenseOffset)
        })
        
    },

    posCalc : function(){
        //position nodes
        d3.selectAll('circle.graphNode.'+this.svg)
        .attr('cx', v => v.x)
        .attr('cy', v => v.y)
        //position line element
        d3.selectAll('line.graphEdge.'+this.svg+', line.clickbox.'+this.svg)
        .attr('x1', e => e.source.x)
        .attr('y1', e => e.source.y)
        .attr('x2', e => {
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            return e.target.x - normalizeDXDY[0]*Math.cos(30*Math.PI/180)*(this.arrowSize+this.nodeR1)
        })
        .attr('y2', e => {
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            return e.target.y - normalizeDXDY[1]*Math.cos(30*Math.PI/180)*(this.arrowSize+this.nodeR1)
        })
        // node,edge text position
        d3.selectAll('text.name.'+this.svg)
        .attr('x', v => v.x)
        .attr('y', v => v.y - this.textSize * 0.75)
        d3.selectAll('text.node.'+this.svg)
        .attr('x', v => v.x)
        .attr('y', v => v.y + this.textSize * 0.75)
        d3.selectAll("text.edge."+this.svg)
        .attr("x", e => {
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
            let tenseOffset = this.ssspHelp.tense(e) ? this.tenseLinkSize-2 : 0;
            return e.source.x + (e.target.x - e.source.x)/2 + nOrthogonal[0]*(this.edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(this.textSize/4)+ tenseOffset)
        })
        .attr("y", e => {
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
            let tenseOffset = this.ssspHelp.tense(e) ? this.tenseLinkSize-2 : 0;
            return e.source.y + (e.target.y - e.source.y)/2 + nOrthogonal[1]*(this.edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(this.textSize/4)+ tenseOffset)
        })
        //edge arrowtip position
        d3.selectAll("polygon."+this.svg)
        .attr("points", e=>{
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            let nPlus = Vector.rotate(normalizeDXDY, 30)
            let nMinus = Vector.rotate(normalizeDXDY, -30)
            let xTip = e.target.x-normalizeDXDY[0]*this.nodeR1
            let yTip = e.target.y-normalizeDXDY[1]*this.nodeR1
            let xLeft = xTip - nMinus[0] * this.arrowSize
            let yLeft = yTip - nMinus[1] * this.arrowSize
            let xRight = xTip - nPlus[0] * this.arrowSize
            let yRight = yTip - nPlus[1] * this.arrowSize
            return xTip+","+yTip+" "+xLeft+","+yLeft+" "+xRight+","+yRight
        })
        //tense edge position
        d3.selectAll("ellipse."+this.svg)
        .attr("cx", e=>{
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            return e.source.x + (e.target.x-e.source.x)/2 - normalizeDXDY[0]*Math.cos(30*Math.PI/180)*this.arrowSize/2
        })
        .attr("cy", e=>{
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            return e.source.y + (e.target.y-e.source.y)/2 - normalizeDXDY[1]*Math.cos(30*Math.PI/180)*this.arrowSize/2
        })
        .attr("rx", e=>{
            if((Math.sqrt((e.target.x-e.source.x)**2 + (e.target.y-e.source.y)**2) / 2 - this.nodeR1) - Math.cos(30*Math.PI/180)*this.arrowSize/2 < 0) return 0
            return Math.sqrt((e.target.x-e.source.x)**2 + (e.target.y-e.source.y)**2) / 2 - this.nodeR1 - Math.cos(30*Math.PI/180)*this.arrowSize/2
        })
        //.attr("ry", e=>{if(Algo.tense(e)){return 10}else{return 3}})
        .attr("transform", e =>{
            let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
            if((e.target.x-e.source.x) == 0) return 0
            return "rotate("+ (Math.atan((e.target.y-e.source.y)/(e.target.x-e.source.x))* 180 / Math.PI) +","
                            + ((e.source.x + (e.target.x-e.source.x)/2) - normalizeDXDY[0]*Math.cos(30*Math.PI/180)*this.arrowSize/2) +","
                            + ((e.source.y + (e.target.y-e.source.y)/2) - normalizeDXDY[1]*Math.cos(30*Math.PI/180)*this.arrowSize/2) +")"
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
        .attr("stroke-width", d=> {
            let delta = this.maxWeight - this.minWeight
            let interval = delta / 11
            return 1 + Math.floor((d.key-this.minWeight) / interval)
        })
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
        
        this.tenseLink = field
        .selectAll("ellipse."+name)
        .data(this.graph.edges)
        .enter()
        .append("ellipse")
        .classed(name, true)
        .on("mousedown", v=> {if(!this.freeze){return this.ellipseClick(v,name,sim)}})

        this.linkDirection = field
        .selectAll("polygon."+name)
        .data(this.graph.edges)
        .enter()
        .append("polygon")
        .classed(name, true)

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
            if(this.freeze){return}
            d3
            .selectAll("circle.graphNode."+name)
            .filter(d=> v.index === d.index)
            .classed("hover", true)
            .transition()
            .duration(this.animationDuration)
            .attr("r", this.nodeR2)
        })
        .on("mouseout", v=>{
            if(this.freeze){return}
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

        this.nodeName = field
        .selectAll("text.name."+name)
        .data(this.graph.vertices)
        .enter()
        .append("text")
        .classed("name", true)
        .classed(name,true)
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("font-family", "Comic Sans MS")
        .style("font-size", this.textSize)
        .style("font-weight", "bold")
        .style("fill", "white")

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
        .style("fill", "white")

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
        .select("#"+name)
            .append("svg")
            .attr("class", name)
            
            
        field = d3.select("svg."+name);

        let element = document.getElementById(name)
        let style = window.getComputedStyle(element)
        this.width = parseInt(style.getPropertyValue("width"))
        this.height = parseInt(style.getPropertyValue("height"))

        field
        .attr("width", this.width)
        .attr("height", this.height)

        sim = d3.forceSimulation(this.graph.vertices)
            //.force("link", d3.forceLink(graph.edges).distance(100).strength(2))
            .force("link", d3.forceLink(this.graph.edges).distance(50).strength(0.9))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(this.width/2,this.height/2))
            .force('collide', d3.forceCollide(50).iterations(6))
            .force('xAxis', d3.forceX(this.width / 2).strength(0.1))
            .force('yAxis', d3.forceY(this.width / 2).strength(0.1))
            .on('tick', () => {
                this.posCalc()
                if(this.startup){
                    this.update()
                    this.startup = false
                }
            })
        ;
        this.sim1 = sim
        sim.velocityDecay(0.1)
        sim.tick(500)
        sim.velocityDecay(0.3)
        this.freeze = true
        setTimeout(()=>{this.freeze = false}, this.animationDuration)
        this.draw(name,field,sim);
        
    },
    recenter: function(){

        let element = document.getElementById(this.svg)
        let style = window.getComputedStyle(element)
        this.width = parseInt(style.getPropertyValue("width"))
        this.height = parseInt(style.getPropertyValue("height"))

        this.sim1.force("center", d3.forceCenter(this.width/2,this.height/2))
        .force('xAxis', d3.forceX(this.width / 2).strength(0.1))
        .force('yAxis', d3.forceY(this.width / 2).strength(0.1))
        .alpha(1).restart()

        d3.select("svg."+this.svg)
        .attr("width", this.width)
        .attr("height", this.height)
    }
}

export {vsDijkstraGraph}