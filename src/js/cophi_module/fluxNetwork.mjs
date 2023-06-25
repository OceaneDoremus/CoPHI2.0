


import { Axe } from "./Axe.mjs"
import { Node } from "./Nodes.mjs"

import { createTooltip, findDescendants, findAncestors, currentElement, getPaths } from "./utils.mjs"


export function Pcp() {
    // DEFAULT VALUE IF NOT SPECIFIED
    let container
    let xScale = 0
    let height = 110
    let width = 400
    let margin = { top: 90, right: 10, bottom: 10, left: 10 }
    let numberOfCategories = 3
    let nodeWidth = 150
    let colors = ['#da1e37', '#3e1f47', '#0b525b']
    let state = "middle"
    let paddingAxes = 28
    let scale
    let opacity = { nodes: 1, paths: 1 }
    // OTHERS ATTRIBUTES
    let pathColors = '#505D75'
    let data
    let dimensions
    let table
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
    let newDimension
    let allAxes = []



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
        const sdy = source.weight < 15 ? 5 : source.weight
        const tdy = target.weight < 15 ? 5 : target.weight


        return (tension === 1 ? `M${sx},${source.y0}L${tx},${target.y0}v${tdy}L${sx},${source.y0 + sdy}Z`
            : `M${sx},${source.y0}C${tension * sx + (1 - tension) * tx},${source.y0} ${tension * tx + (1 - tension) * sx},${target.y0} ${tx},${target.y0}v${tdy}C${tension * tx + (1 - tension) * sx},${target.y0 + tdy} ${tension * sx + (1 - tension) * tx},${source.y0 + sdy} ${sx},${source.y0 + sdy}Z`)
    }
    /**
     * For each dimension, create an axis and corresponding nodes
     * @returns allAxes, a list of Axis Objects
     */

    function generateAxis() {

        console.log("[-- START AXIS CREATION --]")

        for (let i = 0; i < dimensions.length; i++) {
            let ee = xScale(dimensions[i])
            let axe = new Axe(dimensions[i], ee)
            allAxes.push(axe)
        }
        console.log("[-- ALL AXES CREATEDD -- ] : ")
        return allAxes
    }
    function setPosNode(height, category) {
        if (category == 2 && height < 120) {
            return 120 - (height);
        } if (category == 1 && height < 120) {
            return 260 - (height / 2);
        } if (category == 0) {
            return 380;
        } if (category == 2 && height >= 120) {
            return 0;
        } if (category == 1 && height >= 120) {
            return 200;
        }

    }

    /**
    * For each dimension, create all corresponding nodes for an axis
     * @returns nodes, a list of Nodes Objects
     */

    function generateNodes(axes) {


        const nodes = dimensions.flatMap(dim => {
            const counts = d3.rollup(data, v => v.length, d => d[dim])
            return Array.from(counts, ([value, count]) => ({
                id: `${dim}-${value}`,
                parentAxe: dim,
                dim,
                value,
                count
            }))
        }).map(nodeData => {
            const node = new Node(nodeData.id, nodeData, nodeData.parentAxe)
            node.count = nodeData.count
            node.setHeightAndPosition(xScale, total)
            return node
        })

        nodes.forEach(node => {
            const parentAxe = axes.find(axe => axe.name === node.parentAxe)
            parentAxe.addNodes(node)
        })

        return nodes
    }

    function generatePaths() {

        let links = []


        data.forEach(function (d, i) {
            let pairs = d3.pairs(dimensions)

            pairs.forEach(function (p) {

                let codeS = p[0] + "-" + d[p[0]] ;
               let codeT =  p[1] + "-" + d[p[1]];
                let source = { name: p[0], value: d[p[0]], x: xScale(p[0]), count: 1 }
                let target = { name: p[1], value: d[p[1]], x: xScale(p[1]), count: 1 }
                let link = { graph:0,codeS: codeS,codeT:codeT, source: source, target: target }
                let foundLink = links.find(function (l) {
                    return l.source.name === source.name && l.target.name === target.name && l.source.value === source.value && l.target.value === target.value
                })
                if (foundLink) {
                    foundLink.source.count++
                    foundLink.target.count++
                } else {
                    links.push(link)
                }
            })
        })

        links.forEach(function (p) {
            p.source.weight = (110 * p.source.count / total)
            p.target.weight = (110 * p.target.count / total)
            p.source.y0 = setPosNode(p.source.weight, p.source.value)
            p.target.y0 = setPosNode(p.target.weight, p.target.value)
            p.source.y1 = p.source.y0 - p.source.weight
            p.target.y1 = p.target.y0 - p.target.weight

        })
        return links
    }

    function updateLinks(svg, selection) {
        if (getState !== "min") {
            var lines = generatePaths()
            svg.append("g")
                .attr("class", "background")
                .attr("graph", selection.attr("class"))
                .selectAll("path")
                .data(lines)
                .enter().append("path")
                .attr("graph", selection.attr("class"))
                .attr("d", d => ribbonPathString(d.source, d.target, 0.5))

                .attr("id", d => d.source.name + "-" + d.source.value)
                .attr("child", d => d.target.name + "-" + d.target.value)
                .attr("fill", pathColors)

        }
    }
    function generateTable(axes){
;

    }


    function pcp(selection) {
        axes = generateAxis(data)
        nodes = generateNodes(axes)
        lines = generatePaths()
        updateNodesColors(colors)
        updatePathColors(pathColors)
        updateOpacity(opacity)

        total = data.length

        console.log("[-- START MODULE  --]")

        // render
        const svg = selection.append('svg')
            .attr('id', 'svg_container')
            .attr("graph", selection.attr("class"))
            .attr('width', width)
            .attr('height', height)
            .attr('margin-top', margin.top)

        // Add axes
        const allAxes = svg.selectAll(".axes")
            .data(axes)
            .enter().append("g")
            .attr("graph", selection.attr("class"))
            .attr("name", d => d.name)
            .attr("fill", "black")
            .attr("width", "15")
            .attr("class", "axis")
            .attr("transform", function (d) { return "translate(" + xScale(d.name) + ")" })
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
            if (getState() == "max" || getState() == "middle") {

                updateLinks(svg, selection)
            }
            if (tableData) {
                // table.reorder(dimensions);
            }

        }

        function position(d) {
            var v = dragging[d]
            return v == null ? xScale(d) : v
        }

        // Add lines for each axis
        const axesLine = allAxes.append("line")
            .attr("graph", selection.attr("class"))
            .attr("x1", 10)
            .attr("y1", 0)
            .attr("x2", 10)
            .attr("y2", 500)
            .attr("stroke", "grey")
            .attr("stroke-width", "1")
            .attr("opacity", 0.2)

        // Add axis label
        const axesLabel = allAxes
            .attr("graph", selection.attr("class"))
            .append("text")
            .attr("class", "labels")
            .text(d => d.name.slice(0, 8))
            .style("font-size", 20 + "px")
            .style("transform", "rotate(-90deg)")
            .attr("x", -height + 70) 
            .attr("dy", 10) 
            .style("text-anchor", "start"); 


        // Add remove button 
        ////////////////// BOX AXES //////////////////
        // // ADD checkBox for each axis
        const checkboxGroup = allAxes.append("g")
            .attr("id", selection.attr("class"))

            .attr("class", "checkbox-group")
            .append("circle")
            .attr("r", 10)
            .attr("cy", 650)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
                const axis = d3.selectAll(".axis").filter(axis => axis.name === d.name).node()
                const child = axis.children
                const line = child[0]

                d3.select(line)
                    .style("stroke-width", "20px")
                    .style("stroke", "purple")
                    .style("stroke-opacity", 0.3)
            })

            .on("mouseout", function (event, d) {

                const axis = d3.selectAll(".axis").filter(axis => axis.name === d.name).node()
                const child = axis.children
                const line = child[0]
                d3.select(line)
                    .style("stroke-width", null)
                    .style("stroke", null)
            })
        checkboxGroup
            .on("click", function (event, d) {
                const elementIndex = dimensions.findIndex(element => element === d.name)
                let currentEl = d3.selectAll('.axis')
                    .filter(function () {
                        return d3.select(this).attr('name') == d.name && d3.select(this).attr('graph') == selection.attr('class')
                    })
                currentEl.attr("visibility", "hidden")


                let newAxes = axes.splice(axes.findIndex(axe => axe.name == d.name), 1)
                const removeElement = d3.selectAll(".background").filter(function () {
                    return this.getAttribute("graph") === selection.attr("class")
                })


                removeElement.remove()
                xScale.domain(axes.map(axe => axe.name))
                dimensions = dimensions.filter(dim => dim != d.name)
                xScale.domain(dimensions)
                addRemoved(d)

                if (getState() != "min") {
                    updateLinks(svg, selection)
                }

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
            var rect = d3.select(this).selectAll("rect")
                .attr("graph", selection.attr("class"))

                .data(axis.nodes)
                .enter().append("rect")
                .attr("class", "rect-nodes")
                .attr("graph", selection.attr("class"))
                .attr("name", d => d.name)
                .attr('title', d => "name : " + d.name + " count :  " + d.count)
                .attr("width", nodeWidth)
                .attr("height", function (d) { return d.height })
                .attr("y", function (d) { return d.yPos[0] })
                .attr("category", d => "category" + d.value)
                .attr("fill", d => "url(#" + gradients["gradient" + d.value].attr("id") + ")")                           
                .on("mouseover", function (event, d) {
                    let info = "Node : " + d.name + "\nCount : " + d.count

                    showTip(event, info)
                })
                .on("mouseout", function () {
                    hideTip()
                })

        })

        // Add the paths

        background = svg.append("g")
            .attr("graph", selection.attr("class"))

            .attr("class", "background")
            .selectAll("path")
            .data(lines)
            .enter().append("path")
            .attr("graph", selection.attr("class"))
            .attr("d", d => ribbonPathString(d.source, d.target, 0.5))
            .attr("id", d => d.source.name + "-" + d.source.value)
            .attr("child", d => d.target.name + "-" + d.target.value)
            .attr("fill", pathColors)
        var rect = d3.selectAll(".rect-nodes").on("click", function (event, d) {
            var el = event.target.getAttribute("name")
            var g = event.target.getAttribute("graph")
            var current = currentElement(g,el)
            const child = findDescendants(g,el)
            const parents = findAncestors(g,el)
            d3.selectAll("path")
                .attr("opacity", 0.7)

            d3.selectAll(current)
                .attr("fill", "#e63946")
                .attr("opacity", 1)

            d3.selectAll(child)
                .attr("fill", "#e63946")
                .attr("opacity", 1)

            d3.selectAll(parents)
                .attr("fill", "#e63946")
                .attr("opacity", 1)

        })
    }
    pcp.rescale = function (value, el,selection) {
        
        const g = el
        const removeElement = d3.selectAll(".background").filter(function () {
            return this.getAttribute("graph") === g
        })
        removeElement.attr("visibility", "hidden")
        xScale.range([0, value])
        let svg = d3.selectAll('svg#svg_container').filter(function () {
            return this.getAttribute("graph") === g
        })
        console.log(svg,selection)
        updateLinks(svg,selection)
        pcp.transition(el)
    };

    pcp.render = function (v, selection) {
        const currentselection =selection.node().className;
        this.dimensions().push(v.name)

        xScale
            .domain(dimensions)
        axes.push(v)
        var filteredElements = d3.selectAll('g.axis[name="' + v.name + '"]').attr('visibility', 'visible');
        const removeElement = d3.selectAll(".background").filter(function () {
            return this.getAttribute("graph") === currentselection
        })
        removeElement.attr("visibility", "hidden")
        let svg = d3.selectAll('svg#svg_container').filter(function () {
            return this.getAttribute("graph") === currentselection
        });
      

        updateLinks(svg,selection);
        pcp.transition(currentselection);

    }
    pcp.transition = function (selection) {

        const ax = d3.selectAll(".axis").filter(function () {
            return this.getAttribute("graph") === selection
        })
        ax.attr("transform", function (d) { return "translate(" + xScale(d.name) + ")" })
        const paths = d3.selectAll("path").filter(function () {
            return this.getAttribute("graph") === selection
        })
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

    pcp.colors = function (value) {
        if (!arguments.length) return colors
        colors = value

        return pcp
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

    pcp.pathColors = function (value) {
        if (!arguments.length) return pathColors
        pathColors = value
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

    function updateOpacity(selection) {
        d3.selectAll(".rect-nodes")
            .style("opacity", opacity.nodes)
        d3.selectAll("path")
            .style("opacity", opacity.paths)
    };
    function updateNodesColors(selection) {
        d3.selectAll(".rect-nodes")
            .style("fill", function (d) { return colors[d.value] })
            .attr('opacity',1)
      
    };
    function updatePathColors(selection) {
        d3.selectAll("path").attr('opacity',1)
            .style("fill", function (d) { return pathColors })
            .attr('opacity',1)
   
    };
    pcp.reset = function () {
        pcp
        return pcp;
    };

    return pcp

}