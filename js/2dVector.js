export function getLength(x){
    return Math.sqrt(x[0]**2 + x[1]**2)
}

export function normalize(x){
    let vectorLength = getLength(x)
    return [x[0]/vectorLength,x[1]/vectorLength]
}

export function rotate(x,angle){
    let radian = angle* Math.PI/180
    return [x[0]*Math.cos(radian)-x[1]*Math.sin(radian), x[1]*Math.cos(radian)+x[0]*Math.sin(radian)]
}

export function dotProduct(a,b){
    return a[0]*b[0] + a[1]*b[1]
}

export function angleOf(a,b){
    return Math.acos(dotProduct(a,b) / getLength(a)*getLength(b))
}