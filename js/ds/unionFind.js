export default class UnionFind{
    /**
     * 
     * @param {*} vertices Needs to be an array with length equal to the number of vertices
     */
    constructor(vertices){
        this.data = []
        for(let i =0; i<vertices.length;i++){
            this.data.push(i)
        }
        this.stateMemory = []
    }
    /**
     * reset current state and memory of previous states
     */
    reset(){
        for(let i =0; i<this.data.length; i++){
            this.data[i] = i
        }
        this.stateMemory = []
    }
    /**
     * 
     * @param {*} v Name of Node as Number
     * Find the tag of the Node
     */
    find(v){
        return this.data[v]
    }
    /**
     * 
     * @param {*} v1 Name of Node 1
     * @param {*} v2 Name of Node 2
     * @returns true, if successful, false, if union not possible, v1 and v1 having same tag
     */
    union(v1,v2){
        let s1 = this.find(v1)
        let s2 = this.find(v2)
        if(s1 != s2){
            this.stateMemory.push(this.data.slice())
            //random Tag
            let random = Math.floor(Math.random()*2)
            if(random == 0){
                let s3 = s1
                s1 = s2
                s2 = s3
            }
            for(let i = 0; i<this.data.length; i++){
                if(this.data[i] === s2){
                    this.data[i] = s1
                }
            }
            return true
        }
        return false
    }
    /**
     * Sets current state back to the previous state
     */
    undo(){
        if(this.stateMemory.length > 0){
            this.data = this.stateMemory.pop()
        }
    }
}