
/** @author Océane Dorémus
 */
export class Axe {
  constructor(name, position) {
    this.name = name;
    this.nodes = [];
    this.countNodes = 0;
    this.position = position;
  }
  setCount(count) {
    this.countNodes = count;
  }

  addNodes(nodes) {
    this.nodes.push(nodes);
    this.setCount(1);
    this.countNodes++;
  }
}
