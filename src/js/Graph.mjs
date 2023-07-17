import { Plot } from "./cophi_module/cophi.mjs";

export class Graph {
  constructor(data) {
    this.container = "graph-container";
    this.data = data;
    this.hiddenElement = [];
  }

  tableData() {
    const btn = d3.select("#btn-table");
    const table = d3.select("#bottom");

    btn.on("click", () => {
      if (table.style("display") === "none") {
        table.style("display", "block");
      } else {
        table.style("display", "none");
      }
    });
  }
  addObjet(el) {
    this.hiddenElement.push(el);
    this.setNewHiddenElement();
  }

  removeElementListener(plot) {
    d3.selectAll(".checkbox-group").on("click", (event, d) => {
      this.addObjet(d);
      plot.transition(this.container);
    });
  }

  addElementListener(plot, container) {
    const select = d3.select(`#sidebar-add`);
    const btn = d3.select("#btn-delete");
    const self = this;
    btn.on("click", function () {
      if (select.node().options.length > 0) {
        const selectedIndex = select.property("selectedIndex");
        const selectedOption = select.node().options[selectedIndex];
        const selectedValue = selectedOption.value;

        self.hiddenElement = self.hiddenElement.filter(
          (el) => el.name !== selectedValue
        );

        select.node().removeChild(selectedOption);
        plot.render(d3.select(selectedOption).datum(), container);
      }
    });
  }

  setNewHiddenElement() {
    const selection = d3.select("#sidebar-add");
    const options = selection
      .selectAll("option")
      .data(this.hiddenElement)
      .enter()
      .append("option")
      .text((d) => d.name)
      .attr("value", (d) => d.name);
  }

  /**
   * Get slider changes values to change graph scale
   * @param {*} plot
   * @param {*} container
   */

  getScale(plot, container) {
    const slider = d3.select(`#slider`);
    const containerValue = this.container;
    slider.on("input", function () {
      const value = this.value;
      plot.rescale(value, container);
    });
  }
  /**
   * Change nodes colors
   * @param {*} plot
   */
  getNodesColors(plot) {
    const selectColorsNode = d3.select("#content-selector-col-nodes");
    selectColorsNode.on("change", function () {
      const selectedValue = d3.select(this).property("value");
      let col = [];
      if (selectedValue === "opt1") {
        col = ["#da1e37", "green", "orange"];
      } else if (selectedValue === "opt2") {
        col = ["black", "grey", "darkblue"];
      } else if (selectedValue === "opt3") {
        col = ["purple", "gray", "green"];
      }
      plot.colorsN(col);
    });
  }

  /**
   * Change paths colors
   * @param {*} plot
   */
  getPathsColors(plot) {
    const selectColorPath = d3.select("#content-selector-col-paths");
    selectColorPath.on("change", function () {
      const selectedValue = d3.select(this).property("value");
      let col = [];
      if (selectedValue === "opt1") {
        col = ["lightgrey", "darkgrey"];
      } else if (selectedValue === "opt2") {
        col = ["grey", "yellow"];
      } else if (selectedValue === "opt3") {
        col = ["#505D75", "red"];
      }
      plot.colorsP(col);
    });
  }

  /**
   * Start multi-graph creation
   */
  initPCP() {
    let columns;
    if (this.data.length === 1) {
      columns = this.data[0].columns.sort();
    } else {
      columns = this.data[0].columns;
    }

    const selection = d3.select("#" + this.container);
    const config = {
      container: selection,
      margin: { top: 20, right: 20, bottom: 30, left: 40 },
      categories: 3,
      dimensions: columns.sort(),
      width: columns.length * 25,
      height: 450 * this.data.length,
      total: this.data.length,
      nodeWidth: 10,
    };

    // Call Plot
    const plot = Plot()
      .container(config.container)
      .width(config.width)
      .height(config.height)
      .margin(config.margin)
      .xScale(1000, config.dimensions)
      .colorsN(["#da1e37", "#006466", "yellow"])
      .colorsP(["#505D75", "red"])
      .numberOfCategories(config.categories)
      .nodeWidth(config.nodeWidth)
      .data(this.data)
      .dimensions(config.dimensions)
      .total(config.total)
      .allowTooltip(true)
      .draggable(true);

    plot(selection);

    this.getScale(plot, config.container);
    this.getNodesColors(plot);
    this.getPathsColors(plot);
    this.removeElementListener(plot);
    this.addElementListener(plot, selection);
    this.tableData();
  }
}
