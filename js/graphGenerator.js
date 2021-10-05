export function exgraph(){
    const graph = {vertices:[] , edges:[]};
    for (let i = 0; i < 4; i++){
        graph.vertices[i] = { name: i, key:0};
    }
    graph.edges[0] = {source: 0, target: 1, key: 4};
    graph.edges[1] = {source: 1, target: 2, key: 5};
    graph.edges[2] = {source: 2, target: 3, key: 2};
    graph.edges[3] = {source: 3, target: 0, key: 7};
    graph.edges[4] = {source: 0, target: 2, key: 3};
    graph.edges[5] = {source: 1, target: 3, key: 5};
    return graph;
}

export function mstGraph(){
    const graph = {vertices:[], edges:[]};
    const min = 12;
    const max = 17;
    const weightMin = 1;
    const weightMax = 12;
    const vDegree = [];
    const connected = [];
    const verticesAmount = Math.floor(Math.random() * (max+1-min) + min);
    for (let i = 0; i < verticesAmount; i++){
        graph.vertices[i] = { name: i, key: 0};
        vDegree[i] = 0;
    }

    connected.push(0);
    for (let i = 1; i< verticesAmount; i++){
        if (i != connected.find(v => v === i)){
            let randomSource = Math.floor(Math.random()*connected.length);
            graph.edges.push({
                source: randomSource, 
                target: i, 
                key: Math.floor(Math.random()*(weightMax+1-weightMin) + weightMin)
            });
            vDegree[randomSource]++;
            vDegree[i]++;
            connected.push(i);

        }
    }
    let degreeOne = [];
    for(let i = 0; i<vDegree.length;i++){
        if(vDegree[i] === 1){
            degreeOne.push(i);
        }
    }
    
    while(degreeOne.length > 1){
        let index = Math.floor(Math.random()*degreeOne.length);
        let r1 = degreeOne[index];
        degreeOne.splice(index, 1);
        index = Math.floor(Math.random()*degreeOne.length);
        let r2 = degreeOne[index];
        degreeOne.splice(index, 1);
        graph.edges.push({
            source: r1, 
            target: r2, 
            key: Math.floor(Math.random()*(weightMax+1-weightMin) + weightMin)
        })
    }

    return graph;    
}

export function tutorialGraph(){
    const graph = {vertices:[], edges:[]};
    for (let i = 0; i < 9; i++){
        graph.vertices[i] = { name: i, key: 0};
    }
    graph.edges[0] = {source: 3, target: 1, key: 4};
    graph.edges[1] = {source: 4, target: 3, key: 5};
    graph.edges[2] = {source: 1, target: 4, key: 2};
    graph.edges[3] = {source: 5, target: 4, key: 7};
    graph.edges[4] = {source: 2, target: 5, key: 3};
    graph.edges[5] = {source: 4, target: 2, key: 5};
    graph.edges[6] = {source: 1, target: 0, key: 4};
    graph.edges[7] = {source: 2, target: 1, key: 2};
    graph.edges[8] = {source: 0, target: 2, key: 6};
    graph.edges[9] = {source: 6, target: 4, key: 5};
    graph.edges[10] = {source: 3, target: 6, key: 1};
    graph.edges[11] = {source: 7, target: 5, key: 6};
    graph.edges[12] = {source: 4, target: 7, key: 1};
    graph.edges[13] = {source: 7, target: 6, key: 4};
    graph.edges[14] = {source: 8, target: 7, key: 3};
    graph.edges[15] = {source: 6, target: 8, key: 7};
    return graph;
}

export function randomGraph(){
    const graph = {vertices:[], edges:[]};
    const min = 12;
    const max = 17;
    const weightMin = 1;
    const weightMax = 12;
    const verticesAmount = Math.floor(Math.random() * (max+1-min) + min);
}

export function copyGraph(g){
    const graph = {vertices:[],edges:[]}
    for(let i = 0; i<g.vertices.length;i++){
        graph.vertices.push({name: i, key: g.vertices[i].key})
    }
    for(let i = 0; i<g.edges.length; i++){
        graph.edges.push({source: g.edges[i].source,
                          target: g.edges[i].target,
                          key: g.edges[i].key})
    }
    return graph
}