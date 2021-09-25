/**
 * helping datastructure for SSSP algorithm, memorizes distance, predecessor. Is able to recognize tense edges, and can relax them.
 */
export default class SsspHelp{
    /**
     * 
     * @param {*} g Graph. Input needs to be an Object with attributes "vertices" and "edges" as arrays.
     *  "vertices" element needs to be an Object with attribute "name" and "key". "edges" element 
     * need attributes "source","target"(both are "vertices" a element)and "key".
     */
    constructor(g){
        this.distance = []
        this.distanceMemory = []
        this.predecessor = []
        this.predecessorMemory = []
        this.graph = g
        for(let i = 0;i<g.vertices.length;i++){
            this.distance.push(g.vertices[i].key)
            if(g.vertices[i].key === 0){
                this.predecessor.push(i)
            }
            else{
                this.predecessor.push(undefined)
            }
        }
    }
    /**
     * 
     * @param {*} edge Graph edge as input
     * @returns true if edge is tense, else false
     */
    tense(edge){
        return this.distance[edge.source.name] + edge.key < this.distance[edge.target.name] ? true : false
    }
    /**
     * 
     * @param {*} edge Graph edge as input.
     * relax edge, update the new distance and predecessor
     */
    relax(edge){
        if(this.tense(edge)){
            this.distanceMemory.push(this.distance.slice())
            this.predecessorMemory.push(this.predecessor.slice())
            this.distance[edge.target.name] = this.distance[edge.source.name] + edge.key
            this.predecessor[edge.target.name] = edge.source.name
        }
    }
    /**
     * reset current state and memory of previous states
     */
    reset(){
        for(let i = 0;i<this.graph.vertices.length;i++){
            this.distance[i] = this.graph.vertices[i].key
            if(this.graph.vertices[i].key === 0){
                this.predecessor[i] = i
            }
            else{
                this.predecessor[i] = undefined
            }
        }
    }
    /**
     * Sets current state back to the previous state
     */
    undo(){
        if(this.distanceMemory.length > 0){
            this.distance = this.distanceMemory.pop()
            this.predecessor = this.predecessorMemory.pop()
            return true
        }
        else{
            return false
        }
    }
}