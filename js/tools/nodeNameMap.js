const nodeNameMap = {
    letters : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    nameMap : [],
    map : function(vertices){
        this.nameMap = []
        for(let i = 0; i<vertices.length;i++){
            this.nameMap.push(this.letters[i])
        }
    }
}

export {nodeNameMap}