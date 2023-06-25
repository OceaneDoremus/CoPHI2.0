export class Axe {
  constructor (name, position) {
    this.name = name
    this.nodes = []
    this.countNodes = 0
    this.position = position
  }
  setCount(count){
    this.countNodes =  count;
  }

  addNodes (nodes) {
    this.nodes.push(nodes)
    // console.log(nodes)
    this.setCount(1);
   this.countNodes++
  }
}
