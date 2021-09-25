const interactiveGraph = {
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
    arrowSize : 20,
    tenseLinkSize : 10,
    textSize : 15,
    tenseLinkColor : "#fc0000",
    relaxLinkSize : 0,
    relaxLinkColor : "#fff130",
    lineSelectedColor : "#fc0000",
    lineHoverColor : "#fc0000",
    lineUnhoverColor : "#fff130",
    lineUnhoverOpacity : 0.25,
    clickboxSize : 15,
    edgeTextOffset : 0,
    animationDuration : 300,
    edgeSelection : [],
    directG : false,
    selection : [],
    mode : undefined,
    svg : undefined,
    //set mode, must be set
    setMode : function(m){
        this.mode = m
    },
    setGraph : function(g){
        this.graph = g
    },
    denyInput : function(){
        this.mode.denyInput()
    },
    allowInput : function(){
        this.mode.allowInput()
    },
    //deletes svg, cleaning up
    cleanUp : function(){
        d3.selectAll("svg."+this.svg).remove()
    },
    reset : function(){
        this.mode.reset()
    },
    undo : function(){
        this.mode.undo()
    },
    //edge hover 
    lineHover : function(v, name){
        this.mode.lineHover(v,name)
    },
    //edge unhover
    lineUnhover : function(lineUnhover,name){
        this.mode.lineUnhover(name)
    },
    //edge click 
    lineClick : function(lineClick,v,name){
        this.mode.lineClick(v,name)
    },
    //tense edge(ellipse) on click 
    ellipseClick : function(ellipseClick,v,name,sim){
        this.mode.ellipseClick(v,name,sim)
    },
    //update all svg elements
    update : function(update){
        this.mode.updateMode()
    },
    //calculates svg element position
    posCalc : function(posCalc){
        this.mode.posCalc()
    },
    //draw svg elements
    draw : async function(name,field,sim){
        this.mode.draw(name,field,sim)
    },
    //create svg and start force-simulation
    initiateSimulation : async function(name,field,sim){
        this.svg = name
        this.cleanUp()
        this.mode.setGraph(this.graph)
        this.mode.initiateSimulation(name, field, sim)
    }
}

export{interactiveGraph}