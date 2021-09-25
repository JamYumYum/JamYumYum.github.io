//import * as G from './algo.js';
import PQueue from './ds/pQueue.js';
import * as G from './graphGenerator.js';
import * as Algo from './algo.js';
import * as Vector from './2dVector.js'
import * as MainUI from './UI/mainUI.js'
import * as dMode from './modus/directedMode.js'
import {interactiveGraph} from './interactiveGraph.js'
//import InteractiveGraph from './interactiveGraph.js'
import {directedMode} from './modus/directedMode.js'
import {undirectedMode} from './modus/undirectedMode.js'
import {kruskalMode} from './modus/kruskalMode.js'
import {primMode} from './modus/primMode.js'
import {vsDijkstraGraph} from './modus/vsDijkstraGraph.js'
import {mstSelectN} from './scenes/gamemode/mstSelectN.js'
import {vsDijkstra} from './scenes/gamemode/vsDijkstra.js'

let graph;
let link;
let node;
let nodeText;
let edgeText;
let linkClickbox;
let tenseLink;
let linkDirection;
let primData;
let kruskalData;
let dijkstraData;
let svg1;
let svg2;
let sim1 = d3.forceSimulation();
let sim2;
let width = 1200;
let height = 700;
let nodeR1 = 20;
let nodeR2 = 24;
let arrowSize = 20;
let tenseLinkSize = 10;
let textSize = 15;
let tenseLinkColor = "#fc0000";
let relaxLinkSize = 0;
let relaxLinkColor = "#fff130";
let lineSelectedColor = "#fc0000";
let lineHoverColor = "#fc0000";
let lineUnhoverColor = "#fff130";
let lineUnhoverOpacity = 0.25;
let clickboxSize = 15;
let edgeTextOffset = 15;
let nodeTextOffset = 0;
let animationDuration = 300;
let edgeSelection = [];
let directedG = false;
let selection = [];

async function displayMenu(){
  
}
//undirected edge hover 
function lineHover(v,name){
  if(!directedG){
    d3.selectAll("line.graphEdge."+name).filter(d=> v.index===d.index)
    //.transition().duration(animationDuration)
    .attr("stroke", lineHoverColor)//.classed("hover", true)
    d3.selectAll("line.graphEdge."+name).filter(d=> v.index!=d.index)
    //.transition().duration(animationDuration)
    .attr("opacity", lineUnhoverOpacity)//.classed("nonhover", true)
  }
}
//undirected edge unhover
function lineUnhover(name){
  if(!directedG){
    d3.selectAll("line.graphEdge."+name)
    //.transition().duration(animationDuration)
    .attr("stroke", e=>{if(selection.indexOf(e) < 0){return lineUnhoverColor} else{return lineSelectedColor}})
    .attr("opacity", 1)//.classed("hover", false).classed("nonhover", false)
  }
}
//undirected edge selected on click
function lineClick(v,name){
  d3
  .selectAll("line.graphEdge."+name)
  .filter(d=> v.index===d.index)
  .attr("stroke", d=>{
    if(selection.indexOf(d) < 0) selection.push(d)
    console.log(selection)
    return lineSelectedColor
  })
}
//tense edge(ellipse) on click
function ellipseClick(v,name,sim){
  //if (!d3.event.active) sim.alphaTarget(0).restart();
  if (!d3.event.active) sim.alphaTarget(0).stop();
  Algo.relax(v)
  updateLine()
  updateEllipse()
  updatePolygon()
  updateText()
  setTimeout(()=>{sim.alphaTarget(0).restart()},animationDuration)
  //if (!d3.event.active) sim.alphaTarget(0);
}
function updateLine(){
  if(!directedG){
    d3.selectAll("line.graphEdge")
    .attr("stroke", e=>{if(selection.indexOf(e) < 0){return lineUnhoverColor} else{return lineSelectedColor}})
  }
  d3.selectAll("line.graphEdge")
  .attr("stroke", e=>{if(Algo.tense(e)&&directedG){return tenseLinkColor}else{return relaxLinkColor}})//.classed("tense", e=>{if(Algo.tense(e)){return true}else{return false}})
  //.classed("directed", e=> directedG ? true:false)
}
//update directed edge, switching between tense and relaxed state
function updateEllipse(){
  d3.selectAll("ellipse")
  .attr("pointer-event", e=>{if(Algo.tense(e)){return "auto"}else{return "none"}})
  .transition()
  .duration(animationDuration)
  .attr("ry", e=>{if(Algo.tense(e)){return tenseLinkSize}else{return relaxLinkSize}})
  .attr("fill", e=>{if(Algo.tense(e)){return tenseLinkColor}else{return relaxLinkColor}})
  //.attr("visibility", )
}
//update arrowtip 
function updatePolygon(){
  d3.selectAll("polygon")
  .transition()
  .duration(animationDuration)
  .attr("fill", e=>{if(Algo.tense(e)){return tenseLinkColor}else{return relaxLinkColor}})
}
//update display of current distance for all nodes
function updateText(){
  d3
  .selectAll("text.node")
  .text(d=> d.key)
  
  d3
  .selectAll("text.edge")
  .text(d=> d.key)
  .transition()
  .duration(animationDuration)
  .style("fill", e=>{if(Algo.tense(e)&&directedG){return "red"}else{return "white"}})
  .attr("x", e => {
    let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
    let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
    let tenseOffset = Algo.tense(e) ? tenseLinkSize-2 : 0;
    return e.source.x + (e.target.x - e.source.x)/2 + nOrthogonal[0]*(edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(textSize/4)+ tenseOffset)
  })
  .attr("y", e => {
    let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
    let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
    let tenseOffset = Algo.tense(e) ? tenseLinkSize-2 : 0;
    return e.source.y + (e.target.y - e.source.y)/2 + nOrthogonal[1]*(edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(textSize/4)+ tenseOffset)
  })
}
//position from the nodes 
function circlePosCalc(){
  d3.selectAll('circle.graphNode')
  .attr('cx', v => v.x)
  .attr('cy', v => v.y)
}
//assigning position from the edge simulation to the line element
function linePosCalc(){
  d3.selectAll('line.graphEdge, line.clickbox')
  .attr('x1', e => e.source.x)
  .attr('y1', e => e.source.y)
  .attr('x2', e => {
    if(directedG){
      let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
      return e.target.x - normalizeDXDY[0]*Math.cos(30*Math.PI/180)*(arrowSize+nodeR1)
    }
    else return e.target.x
  })
  .attr('y2', e => {
    if(directedG){
      let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
      return e.target.y - normalizeDXDY[1]*Math.cos(30*Math.PI/180)*(arrowSize+nodeR1)
    }
    else return e.target.y
  })
}
//node, edge text position
function textPosCalc(){
  d3.selectAll('text.node')
  .attr('x', v => v.x)
  .attr('y', v => v.y + textSize/4)
  d3.selectAll("text.edge")
  .attr("x", e => {
    let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
    let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
    let tenseOffset = Algo.tense(e) ? tenseLinkSize-2 : 0;
    return e.source.x + (e.target.x - e.source.x)/2 + nOrthogonal[0]*(edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(textSize/4)+ tenseOffset)
  })
  .attr("y", e => {
    let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
    let nOrthogonal = Vector.rotate(normalizeDXDY, 90)
    let tenseOffset = Algo.tense(e) ? tenseLinkSize-2 : 0;
    return e.source.y + (e.target.y - e.source.y)/2 + nOrthogonal[1]*(edgeTextOffset+ (Math.cos(Vector.angleOf([1,0], normalizeDXDY)))*(textSize/4)+ tenseOffset)
  })
}
//calculate directed edge arrowtip
function polygonPosCalc(){
  d3.selectAll("polygon")
  .attr("points", e=>{
    let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
    let nPlus = Vector.rotate(normalizeDXDY, 30)
    let nMinus = Vector.rotate(normalizeDXDY, -30)
    let xTip = e.target.x-normalizeDXDY[0]*nodeR1
    let yTip = e.target.y-normalizeDXDY[1]*nodeR1
    let xLeft = xTip - nMinus[0] * arrowSize
    let yLeft = yTip - nMinus[1] * arrowSize
    let xRight = xTip - nPlus[0] * arrowSize
    let yRight = yTip - nPlus[1] * arrowSize
    return xTip+","+yTip+" "+xLeft+","+yLeft+" "+xRight+","+yRight
  })
  .attr("visibility", e=>{
    if(!directedG) return "hidden"
    else return "visible"
  })
}
//calculate tense edge position
function ellipsePosCalc(){
  d3.selectAll("ellipse")
  .attr("cx", e=>{
    let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
    return e.source.x + (e.target.x-e.source.x)/2 - normalizeDXDY[0]*Math.cos(30*Math.PI/180)*arrowSize/2
  })
  .attr("cy", e=>{
    let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
    return e.source.y + (e.target.y-e.source.y)/2 - normalizeDXDY[1]*Math.cos(30*Math.PI/180)*arrowSize/2
  })
  .attr("rx", e=>{
    if((Math.sqrt((e.target.x-e.source.x)**2 + (e.target.y-e.source.y)**2) / 2 - nodeR1) - Math.cos(30*Math.PI/180)*arrowSize/2 < 0) return 0
    return Math.sqrt((e.target.x-e.source.x)**2 + (e.target.y-e.source.y)**2) / 2 - nodeR1 - Math.cos(30*Math.PI/180)*arrowSize/2
  })
  //.attr("ry", e=>{if(Algo.tense(e)){return 10}else{return 3}})
  .attr("transform", e =>{
    let normalizeDXDY = Vector.normalize([e.target.x-e.source.x,e.target.y-e.source.y])
    if((e.target.x-e.source.x) == 0) return 0
    return "rotate("+ (Math.atan((e.target.y-e.source.y)/(e.target.x-e.source.x))* 180 / Math.PI) +","
                    + ((e.source.x + (e.target.x-e.source.x)/2) - normalizeDXDY[0]*Math.cos(30*Math.PI/180)*arrowSize/2) +","
                    + ((e.source.y + (e.target.y-e.source.y)/2) - normalizeDXDY[1]*Math.cos(30*Math.PI/180)*arrowSize/2) +")"
  })
  .attr("visibility", e=>{
    if(!directedG) return "hidden"
    else return "visible"
  })
}
async function initiateSimulation(name, field, sim){
  d3
  .select("body")
    .append("svg")
    .attr("class", name)
    .attr("width", width)
    .attr("height", height);
    
  field = d3.select("svg."+name);
  sim = d3.forceSimulation(graph.vertices)
    //.force("link", d3.forceLink(graph.edges).distance(100).strength(2))
    .force("link", d3.forceLink(graph.edges).distance(50).strength(0.9))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width/2,height/2))
    .force('collide', d3.forceCollide(50).iterations(6))
    .on('tick', () => {
      linePosCalc()
      circlePosCalc()
      textPosCalc()
      polygonPosCalc()
      ellipsePosCalc()
  })
  ;
  draw(name,field,sim);
}

async function clearSimulation(){
  d3
  .selectAll("svg")
  .remove()
}

async function draw(name,field,sim){
    link = field
    .selectAll("line.graphEdge."+name)
    .data(graph.edges)
    .enter()
    .append("line")
    .attr('class', 'graphEdge')
    .classed(name, true)
    .attr("stroke-width", d=> d.key)
    .attr("stroke", lineUnhoverColor)

    linkClickbox = field
    .selectAll("line.clickbox."+name)
    .data(graph.edges)
    .enter()
    .append("line")
    .attr('class', 'clickbox')
    .classed(name, true)
    .attr("stroke-width", clickboxSize)
    .attr("stroke", lineUnhoverColor)
    .attr("opacity", 0)
    .on("mouseover", v => lineHover(v,name))
    .on("mouseout", () => lineUnhover(name))
    .on("mousedown", v => lineClick(v,name))
    
    tenseLink = field
    .selectAll("ellipse")
    .data(graph.edges)
    .enter()
    .append("ellipse")
    .on("mousedown", v=> ellipseClick(v,name,sim))

    linkDirection = field
    .selectAll("polygon")
    .data(graph.edges)
    .enter()
    .append("polygon")

    node = field
    .selectAll("circle.graphNode."+name)
    .data(graph.vertices)
    .enter()
    .append("circle")
    .attr('class', 'graphNode')
    .classed(name,true)
    .attr("r", d=> nodeR1)
    .on("mouseover", function(d){
      d3
      .select(this)
      .classed("hover", true)
      .attr("r", nodeR2)
    })
    .on("mouseout", function(d){
      d3
      .select(this)
      .classed("hover", false)
      .attr("r", nodeR1)
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

    nodeText = field
    .selectAll("text.node."+name)
    .data(graph.vertices)
    .enter()
    .append("text")
    .classed("node", true)
    .classed(name,true)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("font-family", "arial")
    .style("font-size", textSize)
    .style("font-weight", "bold")

    edgeText = field
    .selectAll("text.edge."+name)
    .data(graph.edges)
    .enter()
    .append("text")
    .classed("edge", true)
    .classed(name,true)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("font-family", "arial")
    .style("font-size", textSize)
    .style("font-weight", "bold")
}

async function directedGraphMode(){
  directedG = true
}

async function undirectedGraphMode(){
  directedG = false
}

async function stopForce(sim){
  sim1.force("center", null)
}

function main(){
    //graph = G.exgraph();
    graph = G.mstGraph();
    //initializeGraph();
    let graph2 = G.mstGraph();
    console.log(Algo.prim(graph, 0));
    console.log(Algo.kruskal(graph));
    console.log(Algo.dijkstra(graph,0));

    //initiateSimulation("svg1", svg1,sim1);
    //graph = G.mstGraph();
    //initiateSimulation("svg2", svg2,sim2);
    //clearSimulation();
    //directedGraphMode();
    Algo.initValue(graph, 0)
    Algo.initValue(graph2, 0)
    //updateEllipse()
    //updatePolygon()
    /*
    let simOnline = new Promise(resolve=>{
      initiateSimulation("svg1", svg1,sim1);
      updateLine()
      updateEllipse()
      updatePolygon()
      setTimeout(resolve, 0)
    }).then((v)=>{
      
      updateText()
    })
    MainUI.test()
    */
    //interactiveGraph.setMode(directedMode)
    //interactiveGraph.setMode(undirectedMode)
    //interactiveGraph.setMode(kruskalMode)
    //interactiveGraph.setMode(primMode)
    //interactiveGraph.setGraph(graph)
    //testMode.setGraph(graph2)
    //interactiveGraph.initiateSimulation("svg1", svg1,sim1)
    //testMode.initiateSimulation("svg2",svg2,sim2)
    //setTimeout(()=>{interactiveGraph.denyInput()}, 3000)
    //setTimeout(()=>{interactiveGraph.reset()}, 6000)
    //setTimeout(()=>{testMode.reset()}, 6000)
    //let interactiveG = new InteractiveGraph(kruskalMode,graph,"svg1")
    //interactiveG.initiateSimulation()
    //mstSelectN.start()
    vsDijkstra.start()
}

window.onload = main;
