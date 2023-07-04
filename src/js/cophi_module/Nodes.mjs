
export class Node {
    constructor(name, data, parentAxe,graphPosition) {
        this.name = name;
        this.graphPosition = graphPosition;
        this.graphPadding = this.graphPadding();
        this.value = data.value;
        this.parentAxe = parentAxe.toString();
        this.children = [];
        this.count;
        this.svgheight = 300;
        this.links = [];
        this.height = 28; // correspond a la taille du rect, min à 2
        this.position; // correspond au x
        this.yPos = []; // ytop and ybottom for the links
        this.total;
        this.percentage;
    }

    graphPadding() {
        console.log(400*this.graphPosition);
        return 200*this.graphPosition;
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
        let svgHeight = 400;//(category + 1) * 400 + this.graphPadding; // Hauteur du block pour chaque fichier
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
            return 0 //+ this.graphPadding * 3;
          }
        }
      
        return 0;
      }
      
    

    setHeightAndPosition(x, total) {
        this.height = ( this.count / total)*100; //taille en pourcentage
        this.position = x(this.parentAxe);
        this.yPos = [this.computePosition(this.height, this.value), this.computePosition(this.height, this.value) + this.height];
        this.total = total;
        this.percentage = ((this.count / total) * 100).toFixed(2);
    }

    incrementCount() {
        this.count++;
    }
    
}