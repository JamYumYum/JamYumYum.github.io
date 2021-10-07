import PQueue from './ds/pQueue.js';
/**
 * Calculates MST on given graph using prim's algorithm, additional information for each step given for, vertices visited, edges for MST selected, priority queue status will be returned.
 * @param {*} graph 
 * Graph data as an object, requires "vertices" array and "edges" array as attribute. 
 * @param {*} startvertex 
 * Starting vertex, which the algorithm uses.
 */
export function prim (graph, startvertex) {
    let pQueue = new PQueue();
    for (let i = 0; i < graph.edges.length; i++){
        if((graph.edges[i].source === startvertex) || (graph.edges[i].target === startvertex)){
            pQueue.insert(graph.edges[i]);
        }
    }

    let SetToArray = s => {
        let a = [];
        s.forEach(element => {
            a.push(element);
        })
        return a;
    }

    let result = {vertexSetStep : [], mstStep : [], pQueueStep : []};
    result.vertexSetStep.push(SetToArray(new Set().add(startvertex)));
    result.mstStep.push([]);
    result.pQueueStep.push(pQueue.data.slice());

    while(pQueue.data.length > 1){

        let minEdge = pQueue.extractMin();
        let currentMst = result.mstStep[result.mstStep.length-1].slice();
        let currentSet = new Set(result.vertexSetStep[result.vertexSetStep.length-1]);

        let unvisitedVertex = undefined;
        let visitedVertex = undefined;
        if(!currentSet.has(minEdge.source)){
            unvisitedVertex = minEdge.source;
            visitedVertex = minEdge.target;
        }
        if(!currentSet.has(minEdge.target)){
            unvisitedVertex = minEdge.target;
            visitedVertex = minEdge.source;
        }

        if(unvisitedVertex != undefined){
            currentSet.add(unvisitedVertex);
            currentMst.push(minEdge);
            for(let i = 0; i < graph.edges.length; i++){
                let sources = new Set();
                sources.add(graph.edges[i].source);
                sources.add(graph.edges[i].target);
                if(sources.has(unvisitedVertex) && !sources.has(visitedVertex) && !pQueue.has(graph.edges[i])){
                    pQueue.insert(graph.edges[i]);
                }
            }
        }

        result.vertexSetStep.push(SetToArray(currentSet));
        result.mstStep.push(currentMst);
        result.pQueueStep.push(pQueue.data.slice());
    }

    return result;
}

export function kruskal (graph) {
    let sortedEdges = [];
    let currentMst= [];
    let minHeap = new PQueue();
    for(let i = 0; i < graph.edges.length ; i++){
        minHeap.insert(graph.edges[i]);
    }

    let limit = minHeap.data.length;
    for(let i = 1; i < limit ; i++){
        sortedEdges.push(minHeap.extractMin());
    }

    
    let forest = [];
    for(let i = 0; i<graph.vertices.length ; i++){
        let s = [];
        s.push(graph.vertices[i].name);
        forest.push(s.slice());
    }
    let find = v => {
        let r;
        forest.forEach(element => {
            if(element.indexOf(v)!= -1){
                r = element;
            }
        });
        return r;
    }
    let union = (v1,v2) => {
        let s1 = find(v1);
        let s2 = find(v2);
        if(s1 === s2){
            return false;
        }
        else{
            s2.forEach(element => s1.push(element));
            forest.splice(forest.indexOf(s2), 1);
            return true;
        }
    }
    let copy = a =>{
        let array = [];
        a.forEach(sA => {
            let subArray = [];
            sA.forEach(element =>{
                subArray.push(element);
            })
            array.push(subArray.slice());
        })
        return array;
    }

    let result = {forestStep:[], mstStep:[], edgeStep:[]};
    result.forestStep.push(copy(forest));
    result.mstStep.push([]);
    result.edgeStep.push(sortedEdges.slice());

    while(sortedEdges.length > 0){
        let currentEdge = sortedEdges.shift();
        if(union(currentEdge.source, currentEdge.target) != false){
            currentMst.push(currentEdge);
        }

        result.forestStep.push(copy(forest));
        result.mstStep.push(currentMst.slice());
        result.edgeStep.push(sortedEdges.slice());
    }

    return result;
}

export function checkCycle(edgeSelection){
    let nodesMap = []
    for(let i =0; i< edgeSelection.length; i++){
        if(nodesMap.indexOf(edgeSelection[i].source.name) < 0){
            nodesMap.push(edgeSelection[i].source.name)
        }
        if(nodesMap.indexOf(edgeSelection[i].target.name) < 0){
            nodesMap.push(edgeSelection[i].target.name)
        }
    }
    let adjGraph = []
    for(let i = 0; i<nodesMap.length; i++){
        adjGraph.push([])
        for(let j = 0; j<edgeSelection.length;j++){
            if(nodesMap[i] === edgeSelection[j].source.name){
                adjGraph[i].push(nodesMap.indexOf(edgeSelection[j].target.name))
            }
            if(nodesMap[i] === edgeSelection[j].target.name){
                adjGraph[i].push(nodesMap.indexOf(edgeSelection[j].source.name))
            }
        }
    }
    let visited = []
    for(let i = 0; i<nodesMap.length;i++){
        visited.push(false)
    }
    let stack = []
    let parent = []
    
    for(let i = 0; i<adjGraph.length;i++){
        stack = []
        stack.push(i)
        parent = []
        for(let j = 0; j<nodesMap.length;j++){
            visited[j] = false
        }
        while(stack.length != 0){
            let currentNode = stack.pop()
            visited[currentNode] = true
            for(let k = 0; k<adjGraph[currentNode].length;k++){
                if(!visited[adjGraph[currentNode][k]]){
                    stack.push(adjGraph[currentNode][k])
                    parent[adjGraph[currentNode][k]] = currentNode
                    visited[adjGraph[currentNode][k]] = true                
                }
                else{
                    if(adjGraph[currentNode][k]!=parent[currentNode]){
                        return true
                    }
                }
            }
        }
    }
    return false
}

export function initValue(graph, startvertex){
    graph.vertices[startvertex].key = 0
    let weightSum = 0
    for(let i = 0; i < graph.edges.length; i++){
        weightSum += graph.edges[i].key
    }
    for(let i = 0; i < graph.vertices.length; i++){
        if(i != startvertex){
            graph.vertices[i].key = weightSum + Math.floor(Math.random()*weightSum*0.5)
        }
    }
}

export function tense(edge){
    return edge.source.key + edge.key < edge.target.key ? true : false;
}

export function relax(edge){
    if(tense(edge)){
        edge.target.key = edge.source.key + edge.key
    }
}

function dijkstraTense(graph,edge){
    return graph.vertices[edge.source].key + edge.key < graph.vertices[edge.target].key ? true : false;
}

function dijkstraRelax(graph,edge){
    if(dijkstraTense(graph,edge)){
        graph.vertices[edge.target].key = graph.vertices[edge.source].key + edge.key
    }
}

export function dijkstra (graph,startvertex) {
    //save initial distances
    let initialDistances = []
    for(let i = 0; i<graph.vertices.length; i++){
        initialDistances.push(graph.vertices[i].key)
    }
    //start algorithm
    const pQueue = new PQueue();
    let currentDist = [];
    let currentPred = [];
    const result = {distStep:[], predStep:[], pQueueStep:[], edgeSelection:[]}
    
    pQueue.insert(graph.vertices[startvertex]);
    //initValue(graph, startvertex);
    for(let i = 0; i < graph.vertices.length; i++){
        if(i!=startvertex){
            currentPred[i] = undefined;
            currentDist[i] = graph.vertices[i].key;
        }
        else{
            currentPred[i] = i;
            currentDist[i] = 0;
        }
    }
    
    result.distStep.push(currentDist.slice());
    result.predStep.push(currentPred.slice());
    result.pQueueStep.push(pQueue.data.slice);

    while(pQueue.data.length > 1){
        let currentVertex = pQueue.extractMin();
        let neighbourVertices = [];
        let neighbourEdges = [];
        for(let i=0; i<graph.edges.length; i++){
            if(graph.edges[i].source === currentVertex.name){
                neighbourVertices.push(graph.vertices[graph.edges[i].target]);
                neighbourEdges.push(graph.edges[i]);
            }
        }
        for(let i = 0; i<neighbourEdges.length; i++){
            //console.log(dijkstraTense(graph,neighbourEdges[i]))
            if(dijkstraTense(graph,neighbourEdges[i])){
                dijkstraRelax(graph,neighbourEdges[i]);
                if(pQueue.data.indexOf(neighbourVertices[i]) != -1){
                    pQueue.decreaseKey(pQueue.data.indexOf(neighbourVertices[i]), graph.vertices[i].key);
                }
                else{
                    pQueue.insert(neighbourVertices[i])
                }
                currentPred[neighbourVertices[i]] = currentVertex.name;
                currentDist[neighbourVertices[i]] = graph.vertices[neighbourVertices[i]];
                result.edgeSelection.push(neighbourEdges[i]);
            }
        }
        //console.log(pQueue.data)
        result.distStep.push(currentDist.slice());
        result.predStep.push(currentPred.slice());
        //result.pQueueStep.push(pQueue.data.slice());

        result.pQueueStep.push(pQueue.data.slice);
    }
    //restore initial distances
    for(let i = 0; i<initialDistances.length; i++){
        graph.vertices[i].key = initialDistances[i]
    }
    return result;
}
