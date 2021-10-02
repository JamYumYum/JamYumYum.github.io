const customEvent = {
    edgeClicked : new Event("edgeClicked"),
    legalMove : new Event("legalMove"),
    illegalMove : new Event("illegalMove"),
    doNothing : new Event("doNothing"),
    nodeClicked : new Event("nodeClicked")
}

export{customEvent}