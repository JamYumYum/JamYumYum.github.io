
const sceneManager = {
    activeScene : undefined,
    sceneQueue : [],
    nextScene : function(){
        if(this.activeScene != undefined){
            console.log("active scene != udnefined")
            this.activeScene.exit()
        }
        if(this.sceneQueue.length != 0){
            this.activeScene = this.sceneQueue.shift()
            this.activeScene.start()
        }
    },
    enterQueue : function(scene){
        this.sceneQueue.push(scene)
    },
    resetQueue : function(){
        this.sceneQueue = []
    }
}

export {sceneManager}