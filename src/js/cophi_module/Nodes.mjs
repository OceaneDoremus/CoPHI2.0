
export class Node {
    constructor(name, data, parentAxe) {
        this.name = name;
        this.value = data.value;
        this.parentAxe = parentAxe.toString();
        this.children = [];
        this.count;
        this.links = [];
        this.height = 28; // correspond a la taille du rect, min à 2
        this.position; // correspond au x
        this.yPos = []; // ytop and ybottom for the links
    }
    addLinks(links) {
        this.links.push(links);
    }
    computePosition(height, category) {
        if (category == 2 && height < 120) {
            return 120 - (height);
        } if (category == 1 && height < 120) {
            return 260 - (height /2);
        } if (category == 0) {
            return 380;
        } if (category == 2 && height >= 120) {
            return 0;
        } if (category == 1 && height >= 120) {
            return 200;
        }
    }
    setHeightAndPosition(x, total) {
        this.height = (110 * this.count / total) + 10;
        this.position = x(this.parentAxe);
        this.yPos = [this.computePosition(this.height, this.value), this.computePosition(this.height, this.value) + this.height];
    }

    incrementCount() {
        this.count++;
    }
    
}