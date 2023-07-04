

import { Axe } from "./Axe.mjs"
import { Node } from "./Nodes.mjs"

import { DataTable } from './DataTable.mjs';
import { createTooltip, findDescendants, findAncestors, currentElement, getPaths } from "./utils.mjs"


export function Plot() {
    // DEFAULT VALUE IF NOT SPECIFIED
    let container
    let xScale = 0
    let height = 100
    let minWidth = 1000
    let width = 400
    let margin = { top: 90, right: 10, bottom: 10, left: 10 }
    let numberOfCategories = 3
    let nodeWidth = 0
    let colorsN = ['#da1e37', '#3e1f47', '#0b525b']
    let state = "middle"
    let paddingAxes = 28
    let opacity = { nodes: 1, paths: 1 }
    // OTHERS ATTRIBUTES
    let colorsP = ['#505D75','red']
    let data
    var dimensions

    let total
    let axes
    let nodes
    let background
    let lines
    let allowTooltip
    let draggable
    let tableData
    let hiddenAxis = []
    let newAxes
    let rect
    let coloredPaths = [];
    let newDimension
    let allAxes = []
    let table = [];




    function addRemoved(el) {
        hiddenAxis.push(el)

    }
    function getState() {
        return state
    }

    function showTip(event, info) {
        if (!allowTooltip) { return }
        let el = info
        createTooltip(event, el)
    }
    function hideTip() {
        d3.selectAll("#tooltip").remove()
    }


    function ribbonPathString(source, target, tension) {
        const sx = source.x + nodeWidth
        const tx = target.x
        const sdy = source.weight //< 5 ? 5 : source.weight
        const tdy = target.weight //< 5 ? 5 : target.weight


        return (tension === 1 ? `M${sx},${source.y0}L${tx},${target.y0}v${tdy}L${sx},${source.y0 + sdy}Z`
            : `M${sx},${source.y0}C${tension * sx + (1 - tension) * tx},${source.y0} ${tension * tx + (1 - tension) * sx},${target.y0} ${tx},${target.y0}v${tdy}C${tension * tx + (1 - tension) * sx},${target.y0 + tdy} ${tension * sx + (1 - tension) * tx},${source.y0 + sdy} ${sx},${source.y0 + sdy}Z`)
    }
    /**
     * For each dimension, create an axis and corresponding nodes
     * @returns allAxes, a list of Axis Objects
     */
    function createAxis() {
     
        return dimensions.map(item => {
            let el = xScale(item);
            return new Axe(item, el);
          });
    }
  
   function setPosNode(height, category,i) {
        let svgHeight = 400;
        let max = svgHeight / 3;
        let padding = 5;
        let nodesize = max - padding;
      let graphPadding = 400*i
        if (category === 0) {
          return svgHeight - nodesize +graphPadding;
        } else if (category === 1) {
          return (svgHeight / 2) - (height / 2)+graphPadding;
        } else if (category === 2) {
          if (height < nodesize) {
            return padding + nodesize - height +graphPadding;
          } else {
            return 0;
          }
        }
      
        return 0;
      }
    
      
    /**
    * For each dimension, create all corresponding nodes for an axis
     * @returns nodes, a list of Nodes Objects
     */

    function createNodes(axes) {
var nodes ;
data.forEach((element,i) => {

 nodes = dimensions.flatMap(dim => {
            const counts = d3.rollup(element, v => v.length, d => d[dim])
            return Array.from(counts, ([value, count]) => ({
                id: `${dim}-${value}`,
                parentAxe: dim,
                dim,
                value,
                count,
                file :element.length,
            }))
        }).map(nodeData => {
            const node = new Node(nodeData.id, nodeData, nodeData.parentAxe,i)
            node.count = nodeData.count
            node.setHeightAndPosition(xScale, element.length)
            return node
        })
        nodes.forEach(node => {
            const parentAxe = axes.find(axe => axe.name === node.parentAxe)
            parentAxe.addNodes(node)
        })  
    })
return nodes}
function generatePaths(data) {
    let alllinks = [];

    data.forEach(function (d, i) {
      let links = [];
      d.forEach(function (e, j) {
        let pairs = d3.pairs(dimensions);
  
        pairs.forEach(function (p) {
          let codeS = p[0] + "-" + e[p[0]];
          let codeT = p[1] + "-" + e[p[1]];
          let source = { name: p[0], value: e[p[0]], x: xScale(p[0]), count: 1 };
          let target = { name: p[1], value: e[p[1]], x: xScale(p[1]), count: 1 };
          let link = {
            graph: i,
            codeS: codeS,
            codeT: codeT,
            source: source,
            target: target
          };
          let foundLink = links.find(function (l) {
            return (
              l.source.name === source.name &&
              l.target.name === target.name &&
              l.source.value === source.value &&
              l.target.value === target.value
            );
          });
          if (foundLink) {
            foundLink.source.count++;
            foundLink.target.count++;
          } else {
            links.push(link);
          }
        });
      });
  
      let total = d.length;
  
      links.forEach(function (p) {
        p.source.weight = (p.source.count / total) * 100;
        p.target.weight = (p.target.count / total) * 100;
        p.source.y0 = setPosNode(p.source.weight, p.source.value, i);
        p.target.y0 = setPosNode(p.target.weight, p.target.value, i);
        p.source.y1 = p.source.y0 - p.source.weight;
        p.target.y1 = p.target.y0 - p.target.weight;
      });
  
      alllinks.push(links);
    });
    
  console.log(alllinks)
    return alllinks;
  }
  

    function updateLinks(svg, selection) {
        var lines = generatePaths(data);
        lines.forEach(function (i) {
            const background = svg.append("g")
              .attr("class", "background")
              .selectAll("path")
              .data(i)
              .enter()
              .append("path")
              .attr('graphPosition',d=> d.graph)
              .attr("id", d => d.source.name + "-" + d.source.value)
              .attr("child", d => d.target.name + "-" + d.target.value)
              .attr("fill", colorsP[0])
              .attr('opacity', 1)
              .attr("d", d => ribbonPathString(d.source, d.target, 0.5));
          });
            
    }
    function initTable(data) {
        let table =[]
        data.forEach((element,i) => {
          let current = new DataTable(element,data[0].columns.sort(),i);
          current.createTable();
          table.push(current)
        });
        // default first table active
        const activeTab = d3.select("#tab-0");
        activeTab.classed("active", true);
        d3.select(".tab-contents #tab-0").classed("active", true);
        
    return table;
      }
    


    function pcp(selection) {
  
        axes = createAxis();
        nodes = createNodes(axes);
        lines = generatePaths(data);
        table = initTable(data);

        // render
        const svg = selection.append('svg')
            .attr('id', 'svg_container')
            .attr('width', d => (width < minWidth) ? minWidth : width)
            .attr('height',  height)
            .attr('margin-top', margin.top)

        // Add axes
        const allAxes = svg.selectAll(".axes")
            .data(axes)
            .enter().append("g")
            .attr("name", d => d.name)
            
            .attr("fill", "black")
            .attr("width", "10")
            .attr("class", "axis")
            .attr("transform", function (d) { return "translate(" + xScale(d.name) + ")" })
        
            // Add lines for each axis
        
        const axesLine = allAxes.append("line")
        .attr("x1", 5)
        .attr("y1", 0)
        .attr("x2", 5)
        .attr("y2", height-100)
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "1")

// Add axis label
const axesLabel = allAxes
.append("text")
.attr("class", "labels")
.text(d => d.name.slice(0, 8))
.style("font-size", 20 + "px")
.style("transform", "rotate(-90deg)")
.attr("x", -height+50 ) 
.attr("dy", 10) 
.style("text-anchor", "start"); 
 // Add the paths
 lines.forEach(function (i) {
    const background = svg.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(i)
      .enter()
      .append("path")
      .attr("graph", selection.attr("class"))
      .attr("id", d => d.source.name + "-" + d.source.value)
      .attr("child", d => d.target.name + "-" + d.target.value)
      .attr("fill", colorsP[0])
      .attr('opacity', 1)
      .attr("d", d => ribbonPathString(d.source, d.target, 0.5));
  });
  
        
        const dragging = {}
        allAxes.call(d3.drag()
            .on("start", dragStart)
            .on("drag", dragMoved)
            .on("end", dragEnd))
        function dragStart(event, d) {
            dragging[d.name] = event.x
            const removeElement = d3.selectAll(".background").filter(function () {
                return this.getAttribute("graph") === selection.attr("class")
            })
            removeElement.remove()
            d3.select(this).raise().classed("active", true)

        }

        function dragMoved(event, d) {
            dragging[d.name] = event.x
            d3.select(this).attr("transform", `translate(${event.x},0)`)
            xScale.domain(dimensions.sort((a, b) => position(a) - position(b)))
            dimensions = dimensions.sort((a, b) => position(a) - position(b))
            allAxes.attr("transform", d => `translate(${position(d.name)})`)
        }


        function dragEnd(event, d) {
            delete dragging[d.name]
            d3.select(this).classed("active", false)
            allAxes.attr("transform", d => `translate(${position(d.name)})`)
            
            d3.selectAll(".background").remove()
            console.log("dim drag",dimensions)
            updateLinks(svg, selection)
            table.forEach((element,i) =>  element.reorder(dimensions))
            
        

        }

        function position(d) {
            var v = dragging[d]
            return v == null ? xScale(d) : v
        }

        // Add remove button 
        ////////////////// BOX AXES //////////////////
        // // ADD checkBox for each axis

        const checkboxGroup = allAxes.append("g")
            .attr("id", selection.attr("class"))
            .attr("class", "checkbox-group")
            .append("circle")
            .attr("r", 8)
            .attr("cy", height-30)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
                const axis = d3.selectAll(".axis").filter(axis => axis.name === d.name).selectAll("*");
                axis.attr("opacity", 0.5)
                
            })
            .on("mouseout", function (event, d) {
                const axis = d3.selectAll(".axis").filter(axis => axis.name === d.name).selectAll("*");
                axis.attr("opacity", 1);
            })
            .on("click", function (event, d) {
                const elementIndex = dimensions.findIndex(element => element === d.name)
                let currentEl = d3.selectAll('.axis')
                    .filter(function () {
                        return d3.select(this).attr('name') == d.name 
                    })
                currentEl.attr("visibility", "hidden");
                let newAxes = axes.splice(axes.findIndex(axe => axe.name == d.name), 1)
                const removeElement = d3.selectAll(".background")
                removeElement.remove()
                xScale.domain(dimensions.filter(dim => dim != d.name))
                console.log(xScale.domain())
                dimensions = dimensions.filter(dim => dim != d.name)
                    console.log("dimension apres lcick",dimensions)
                addRemoved(d)
                updateLinks(svg, selection)
                  table.forEach((dataTable) => {
          dataTable.remove(d.name);
        });
            })
        // GRADIENTS
        function createLinearGradient(id, x1, y1, x2, y2, startColor, endColor) {
            var gradient = svg.append("defs")
                .append("linearGradient")
                .attr("id", id)
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2)

            gradient.append("stop")
                .attr("offset", "40%")
                .attr("stop-color", startColor)

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", endColor)

            return gradient
        }

        // Création des dégradés
        var gradients = {
            gradient2: createLinearGradient("gradient2", "0%", "10%", "0%", "100%", "#FBB13C", "#FAD13C"),
            gradient1: createLinearGradient("gradient1", "0%", "0%", "0%", "100%", "#52B147", "#395B50"),
            gradient0: createLinearGradient("gradient0", "0%", "0%", "0%", "100%", "#D23535", "#710000"),
        }
        // Add for each axis the nodes
        allAxes.each(function (axis) {
             rect = d3.select(this).selectAll("rect")
                .data(axis.nodes)
                .enter().append("rect")
                .attr("class", "rect-nodes")
    
                .attr("graphPosition",d=> d.graphPosition)
                .attr("parent", d => d.parentAxe)
                .attr("name", d => d.name)
                .attr('title', d => "name : " + d.name + " count :  " + d.count)
                .attr("width", nodeWidth)
                .attr("height", function (d) { return d.height })
                .attr("y", function (d) { return d.yPos[0] })
                .attr("category", d => "category" + d.value)
                .attr("fill", d => "url(#" + gradients["gradient" + d.value].attr("id") + ")")                           
                .on("mouseover", function (event, d) {
       
                    let info = "<strong>Name</strong> : " + d.name + "<strong><br>Count </strong>: "+ d.count + "<strong><br>Percentage</strong> : " +d.percentage+" %"+ "<strong><br>Category</strong> : " + d.value  + "<strong><br>Axe</strong> : " + d.parentAxe + "<strong><br>File</strong> : " + (d.graphPosition+1);
                    showTip(event, info);
                    d3.selectAll(".rect-nodes")
                      .filter((_, i, nodes) => d3.select(nodes[i]).attr("parent") === d.parentAxe)
                      .attr("opacity", 0.5);
                  })
                .on("mouseout", function () {
                    hideTip();
                    d3.selectAll(".rect-nodes")
                    .attr("opacity", 1);
                })   
              
        })
        rect = d3.selectAll(".rect-nodes").on("click", function (event, d) {
            event.stopImmediatePropagation();
                        var el = event.target.getAttribute("name");
            var g = event.target.getAttribute("graphPosition");
            const current = currentElement(g, el);
            const child = findDescendants(g, el);
            const parents = findAncestors(g, el);
            coloredPaths = coloredPaths.concat(current, child, parents);
            
       
            d3.selectAll(coloredPaths)
                .attr("fill", colorsP[1])
                .attr("opacity", 0.8);
        });
        
        
    }        
    
    
    pcp.render = function (v, selection) {
       dimensions.push(v.name);
console.log("render dim",+dimensions)
        xScale 
            .domain(dimensions);
        axes.push(v);
        var filteredElements = d3.selectAll('g.axis[name="' + v.name + '"]').attr('visibility', 'visible');
        const removeElement = d3.selectAll(".background").remove()
       // removeElement.attr("visibility", "hidden")
        let svg = d3.selectAll('svg#svg_container')
        updateLinks(svg,this.selection);
        pcp.transition(selection);
        table.forEach((element,i) =>  element.add(v.name))


    }
    pcp.rescale = function (value,el) {

        const removeElement = d3.selectAll(".background").attr("visibility", "hidden")
        xScale.range([0, value]).domain(dimensions)
        let svg = d3.selectAll('svg#svg_container').attr('width', value);
        updateLinks(svg,el)
        pcp.transition(el)
    };
    pcp.transition = function (selection) {

        const ax = d3.selectAll(".axis")
        ax.attr("transform", function (d) { return "translate(" + xScale(d.name) + ")" })
         const paths = d3.selectAll("path").attr("transform", function (d) { return "translate(" + xScale(d.name) + ")" })
        return pcp
    }
    pcp.container = function (value) {
        if (!arguments.length) return container
        container = value

        return pcp
    };
    pcp.axes = function () {
        pcp(d3.select('.axis'))
    };
    pcp.width = function (value) {
        if (!arguments.length) return width
        width = value
        return pcp
    };
    pcp.height = function (value) {
        if (!arguments.length) return height
        height = value
        return pcp
    };
    pcp.margin = function (value) {
        if (!arguments.length) return margin
        margin = value
        return pcp
    };
    pcp.numberOfCategories = function (value) {
        if (!arguments.length) return numberOfCategories
        numberOfCategories = value
        return pcp
    };
    pcp.xScale = function (range, domain) {
        if (!arguments.length) return xScale
        xScale = d3.scalePoint()
            .range([0, range])
            .padding(1)
            .domain(domain)
        return pcp
    };

    pcp.nodeWidth = function (value) {
        if (!arguments.length) return nodeWidth
        nodeWidth = value
        return pcp
    };
    pcp.total = function (value) {
        if (!arguments.length) return total
        total = value
        return pcp
    };

    pcp.colorsN = function (value) {
        if (!arguments.length) return colorsN;
        colorsN = value;
        updateNodesColors();
        return pcp;
    };
    pcp.data = function (value) {
        if (!arguments.length) return data
        data = value
        return pcp
    };
    pcp.dimensions = function (value) {
        if (!arguments.length) return dimensions
        dimensions = value
        return pcp
    };
    pcp.newDimension = function (value) {
        if (!arguments.length) return this.newDimension
        dimensions.push(value)
        return pcp
    };
    pcp.allowTooltip = function (value) {
        if (!arguments.length) return allowTooltip
        allowTooltip = value
        return pcp
    };
    pcp.draggable = function (value) {
        if (!arguments.length) return draggable
        draggable = value
        return pcp
    };
    pcp.tableData = function (value) {
        if (!arguments.length) return tableData
        tableData = value
        return pcp
    };
    pcp.opacity = function (value) {
        if (!arguments.length) return opacity
        opacity = value
        return pcp
    };

    pcp.colorsP = function (value) {
        if (!arguments.length) return colorsP;
        colorsP = value;
        updatePathsColors();
        return pcp
    };
    pcp.newAxes = function (value) {
        if (!arguments.length) return newAxes
        axes.push(newAxes)
        return pcp
    };
    function updateData(selection) {
        d3.selectAll(".rect-nodes")
    };
    function getDimensions(){
        return dimensions;
    }

    function updateOpacity(selection) {
        d3.selectAll(".rect-nodes")
            .style("opacity", opacity.nodes)
        d3.selectAll("path")
            .style("opacity", opacity.paths)
    };
    function updateNodesColors() {
        d3.selectAll(".rect-nodes")
            .style("fill", function (d) { return colorsN[d.value] })
            .attr('opacity',1)
      
    };
    function updatePathsColors() {
        d3.selectAll("path")
            .style("fill", function (d) { return colorsP[0] })

   
    };
    pcp.reset = function () {
        pcp
        return pcp;
    };

    return pcp

}