export function getColorDiversity(array){
    let result = []
    let distance = 360 / array.length
    for(let i = 0; i<array.length;i++){
        let hue = distance*i
        result.push("hsl("+hue+",100%,50%)")
    }
    return result
}