
export class Node {
    constructor(name, data, parentAxe,graphPosition) {
        this.name = name;
        this.graphPosition = graphPosition;
        this.graphPadding = this.graphPadding();
        this.value = data.value;
        this.parentAxe = parentAxe.toString();
        this.children = [];
        this.count;
        this.links = [];
        this.height = 10; 
        this.position; // x
        this.yPos = []; // ytop and ybottom for the links
        this.total;
        this.percentage;
    }

    graphPadding() {
        return 300*this.graphPosition;
    }


    addLinks(links) {
        this.links.push(links);
    }

    graphPadding() {
        return 400*this.graphPosition;
    }


    addLinks(links) {
        this.links.push(links);
    }

    computePosition(height, category) {
        let svgHeight = 400;
        let max = svgHeight / 3;
        let padding = 5;
        let nodesize = max - padding;
      
        if (category === 0) {
          return svgHeight - nodesize +this.graphPadding;
        } else if (category === 1) {
          return (svgHeight / 2) - (height / 2)+this.graphPadding;
        } else if (category === 2) {
          if (height < nodesize) {
            return padding + nodesize - height +this.graphPadding;
          } else {
            return 0 
          }
        }
        return 0;
      }
      
    setHeightAndPosition(x, total) {
        this.height = ( this.count / total)*100; 
        this.position = x(this.parentAxe);
        this.yPos = [this.computePosition(this.height, this.value), this.computePosition(this.height, this.value) + this.height];
        this.total = total;
        this.percentage = ((this.count / total) * 100).toFixed(2);
    }

    incrementCount() {
        this.count++;
    }
    
}