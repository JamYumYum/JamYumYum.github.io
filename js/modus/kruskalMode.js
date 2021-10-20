import * as Vector from '../tools/2dVector.js'
import * as Color from '../tools/colorGenerator.js'
import UnionFind from '../ds/unionFind.js';
import { customEvent } from '../events/customEvent.js';
import { nodeNameMap } from '../tools/nodeNameMap.js';
const kruskalMode = {
    ID : "kruskal",
    graph : undefined,
    link : undefined,
    node : undefined,
    nodeName : undefined,
    nodeText : undefined,
    edgeText : undefined,
    linkClickbox : undefined,
    tenseLink : undefined,
    linkDirection : undefined,
    svg1 : undefined,
    sim1 : undefined,
    width : 1200,
    height : 700,
    nodeR1 : 28,
    nodeR2 : 32,
    nodeColor : "#4845ff",
    nodeBorderWidth : 2,
    nodeBorderColor : "#e7e7e7",
    textSize : 17,
    lineSelectedColor : "#f73030",
    lineNotSelectedColor: "white",
    lineHoverColor : "#f73030",
    lineUnhoverColor : "white",
    lineUnhoverOpacity : 0.25,
    clickboxSize : 20, // hover line and extra easy clickable and invisible
    edgeTextOffset : 15,
    animationDuration : 300, // transition duration
    minWeight : undefined,
    maxWeight : undefined,
    ignore : [],   // when edge source and target cannot union, then it will be marked here, reset if union possible
    selection : [], // selected edges
    colors : undefined, // different color for each node tag
    forest: undefined, // union find datastructure
    svg : undefined,  // identifier for svg element and its parent id
    nameMap : undefined, // mapping letters to node index as names
    currentEdge : undefined, //last clicked edge
    currentNode : undefined, // last clicked node
    freeze : false, // dont allow edge selections
    setGraph : function(g){
        this.graph = g
        this.colors = Color.getColorDiversity(g.vertices)
        this.selection = []
        this.forest = new UnionFind(this.graph.vertices)
        this.nameMap = nodeNameMap
        this.nameMap.map(this.graph.vertices)
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
        d3.selectAll("line.clickbox."+name).filter(d=> v.index===d.index)
        .attr("opacity", 0.5)
    },

    lineUnhover : function(name){
        d3.selectAll("line.clickbox."+name)
        .attr("opacity", 0)
    },
    goodMove : function(v){
        //good move, if selected edge is a safe edge and has min weight
        let recentEdge = this.selection[this.selection.length-1]
        let forestState = this.forest.stateMemory[this.forest.stateMemory.length-1]
        for(let i = 0; i<this.graph.edges.length; i++){
            let e = this.graph.edges[i]
            if(forestState[e.source.name] != forestState[e.target.name]){
                if(recentEdge.key > e.key){
                    return false
                }
            }
        }
        return true
    },
    lineClick : function(v,name){
        d3.selectAll("line.graphEdge."+name)
        .filter(d=> v.index===d.index)
        .attr("stroke", d=>{
            this.currentEdge = d
            if(this.selection.indexOf(d) < 0){
                if(!this.forest.union(d.source.name, d.target.name)){
                    //illegal edge selection click, would create cycle
                    if(!this.ignore[d.index]){
                        this.ignore[d.index] = true
                    }
                    document.dispatchEvent(customEvent.illegalMove)
                    console.log("illegal")
                }
                else{
                    this.selection.push(d)
                    document.dispatchEvent(customEvent.legalMove)
                }
            }
            
            console.log(this.currentEdge)
        })
        this.update()
    },

    update : function(){
        //line Update
        d3.selectAll("line.graphEdge")
        .transition()
        .duration(this.animationDuration)
        .attr("stroke", e=>{
            if(this.selection.indexOf(e) < 0){
                //not selected edge
                return this.lineNotSelectedColor
            }
            else{
                return this.colors[this.forest.find(e.source.name)]
            }
        })
        .attr("opacity", e =>{
            if(this.ignore[e.index] && (this.forest.find(e.source.name) == this.forest.find(e.target.name))){
                return 0.25
            }
            else{
                this.ignore[e.index] = false
                return 1
            }
        })
        //nodename update
        d3
        .selectAll("text.name."+this.svg)
        .text(d=> this.nameMap.nameMap[d.name])
        //nodetext
        d3
        .selectAll("text.node")
        .text(d=> {
            return "["+this.forest.find(d.name)+"]"
        })
        //edgeweight text update
        d3
        .selectAll("text.edge")
        .text(d=> d.key)
        .transition()
        .duration(this.animationDuration)
        .style("fill", e=>{
            if(this.selection.indexOf(e) < 0){
                //not selected edge
                return "white"
            }
            else{
                return this.colors[this.forest.find(e.source.name)]
            }
        })
        .attr("opacity", e =>{
            if(this.ignore[e.index] && (this.forest.find(e.source.name) == this.forest.find(e.target.name))){
                return 0.25
            }
            else{
                this.ignore[e.index] = false
                return 1
            }
        })
        //nodeColor
        d3
        .selectAll("circle.graphNode")
        .transition()
        .duration(this.animationDuration)
        .attr("fill", v=>{
            return this.colors[this.forest.find(v.name)]
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
        //node, edge text position
        d3.selectAll('text.name.'+this.svg)
        .attr('x', v => v.x)
        .attr('y', v => v.y - this.textSize * 0.75)
        d3.selectAll('text.node.'+this.svg)
        .attr('x', v => v.x)
        .attr('y', v => v.y + this.textSize * 0.75)
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
        .attr("stroke-width", d=> {
            let delta = this.maxWeight - this.minWeight
            let interval = delta / 11
            return 1 + Math.floor((d.key-this.minWeight) / interval)
        })
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
        .on("mouseover", v=>{
            if(this.freeze){return}
            d3
            .selectAll("circle.graphNode."+name)
            .filter(d=> v.index === d.index)
            .classed("hover", true)
        })
        .on("mouseout", v=>{
            if(this.freeze){return}
            d3
            .selectAll("circle.graphNode."+name)
            .filter(d=> v.index === d.index)
            .classed("hover", false)
            })
        .on("mousedown", v=>{
            this.currentNode = v
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
        //node name
        this.nodeName = field
        .selectAll("text.name."+name)
        .data(this.graph.vertices)
        .enter()
        .append("text")
        .classed("name", true)
        .classed(name,true)
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("font-family", "Lusitana")
        .style("font-size", this.textSize)
        .style("font-weight", "bold")
        .style("fill", "black")
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
        .style("font-family", "Lusitana")
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
        .style("font-family", "Lusitana")
        .style("font-size", this.textSize)
        .style("font-weight", "bold")
    },

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
            .force("link", d3.forceLink(this.graph.edges).distance(50).strength(0.9))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(this.width/2,this.height/2))
            .force('collide', d3.forceCollide(50).iterations(6))
            .force('xAxis', d3.forceX(this.width / 2).strength(0.1))
            .force('yAxis', d3.forceY(this.width / 2).strength(0.1))
            .on('tick', () => {
                this.posCalc()
        })
        ;
        this.sim1 = sim
        this.freeze = true
        setTimeout(()=>{this.freeze = false}, this.animationDuration)
        this.draw(name,field,sim);
        this.update()
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



export {kruskalMode}