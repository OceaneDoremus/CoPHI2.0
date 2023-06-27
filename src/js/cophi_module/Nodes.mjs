
export class Node {
    constructor(name, data, parentAxe) {
        this.name = name;
        this.value = data.value;
        this.parentAxe = parentAxe.toString();
        this.children = [];
        this.count;
        this.svgheight = 300;
        this.links = [];
        this.height = 28; // correspond a la taille du rect, min à 2
        this.position; // correspond au x
        this.yPos = []; // ytop and ybottom for the links
    }
    addLinks(links) {
        this.links.push(links);
    }

    computePosition(height, category) {
        let svgHeight = 300;

        let max = svgHeight / 3;
        let padding = 5;
        let nodesize = max - padding;
    
        if (category === 0) {
                return svgHeight - nodesize ; 
        } else if (category === 1) {
                return (svgHeight / 2)  - (height / 2) 
        } else if (category === 2) {
            if (height < nodesize) {
                return padding + nodesize - height;
            } else {
                return 0;
            }
        }
            return 0;
    }
    
    setHeightAndPosition(x, total) {
        this.height = ( this.count / total)*100; //taille en pourcentage
        this.position = x(this.parentAxe);
        this.yPos = [this.computePosition(this.height, this.value), this.computePosition(this.height, this.value) + this.height];
    }

    incrementCount() {
        this.count++;
    }
    
}