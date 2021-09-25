/**
 * Priority queue, using a min Heap.
 */
export default class PQueue {
    constructor(){
        this.data = [0];
    }

    bubbleUp(index){
        if(index === 1){
            return;
        }
        if(this.data[index].key < this.data[Math.floor(index/2)].key){
            const swap = this.data[index];
            this.data[index] = this.data[Math.floor(index/2)];
            this.data[Math.floor(index/2)] = swap;
            this.bubbleUp(Math.floor(index/2));
        }
    }

    bubbleDown(index){
        const child1 = this.data[index*2];
        const child2 = this.data[index*2+1];
        if(child2 == undefined){
            if(child1 == undefined){
                return;
            }
            else{
                if(this.data[index].key > child1.key){
                    this.data[index*2] = this.data[index];
                    this.data[index] = child1;
                    this.bubbleDown(index*2);
                }
            }
        }
        else{
            if(this.data[index].key > child1.key || this.data[index].key > child2.key){
                if(child1.key > child2.key){
                    this.data[index*2+1] = this.data[index];
                    this.data[index] = child2;
                    this.bubbleDown(index*2+1);
                }
                else{
                    this.data[index*2] = this.data[index];
                    this.data[index] = child1;
                    this.bubbleDown(index*2);
                }
            }
        }
    }
    /**
     * Adding an element to the priority queue.
     * @param {*} element Needs to be an object with attribute "key" having a numerical value.
     */
    insert(element){
        this.data.push(element);
        this.bubbleUp(this.data.length - 1);
    }
    /**
     * Returns the object with minimum "key" value and removes it from the priority queue.
     */
    extractMin(){
        if(this.data.length === 1){
            return undefined;
        }
        if(this.data.length === 2){
            return this.data.pop();
        }
        let min = this.data[1];
        this.data[1] = this.data.pop();
        this.bubbleDown(1);
        return min;
    }
    
    decreaseKey(index, newKey){
        this.data[index].key = newKey;
        this.bubbleUp(index);
    }
    /**
     * Returns true, if the object is in the priority queue, else false.
     * @param {*} element 
     */
    has(element){
        for(let i=1; i<this.data.length; i++){
            if(element === this.data[i]){
                return true;
            }
        }
        return false;
    }
}
