/* eslint-disable no-undef */
import { Pcp } from './cophi_module/fluxNetwork.mjs'
import { DataTable } from './cophi_module/DataTable.mjs'
import {test} from './event.mjs'

export class Chart {
  constructor(container, order, data, lines, key) {
    this.container = container
    this.data = data
    this.lines = lines
    this.keys = data.columns
    this.order = order
    this.hiddenElement = []
    this.addBox()
    this.addSlider()
    this.initPCP()
  }

  getContainer() {
    return this.container
  }

  addObjet(el) {

    this.hiddenElement.push(el)
    this.setNewHiddenElement()
  }


  getHiddenElement() {

    return this.hiddenElement
  }

  addSlider() {
    const slider = d3.select('#sidebar-zoom')
    slider.append('input')
      .attr('type', 'range')
      .attr('id', 'slider-' + this.container)
      .attr('min', 1000)
      .attr('max', 6000)
      .attr('step', 500)
      .attr('value', 1000)
      .style('top', '20px')
      .style('left', '600px')
  }

  addBox() {
    const sidebarAdd = d3.select('#sidebar-add')

    const selectContainer = sidebarAdd.append('div')
      .attr('class', 'content-selector')

    selectContainer.append('label')
      .attr('for', 'selector-' + this.container)
      .text(this.container + ' :')

    const select = selectContainer.append('select')
      .attr('class', 'sel')
      .attr('id', 'selector-' + this.container)
      .attr('graph', this.container)

    // Ajoutez ici les options de sélection si nécessaire
  }

  setNewHiddenElement() {
    const selection = d3.select('#selector-' + this.container)

    const options = selection
      .selectAll('option')
      .data(this.hiddenElement)
      .enter()
      .append('option')
      .attr('value', d => d.name)
   
      .text(d => d.name)

    options.property('value', d => d.name)
      .datum(d => d)
  }
  callPlot(){
    
  }
  initPCP() {
    /// // CONFIG ////
    const container = d3.select('#graph-container')

      const subContainer = container.append('div')
      .attr('class', this.container)
      .attr('id', 'subContainer')

      subContainer.append('text')
      .attr('x', 80)
      .attr('y',-5)
      .attr('dy', '.55em')
      .attr('class', 'label')
.attr('class', 'label')
.text('file : '+this.container )
.style('transform', 'rotate(-90deg)')



/**** BUTTONS PART */
const btnR = subContainer.append('button')
  .attr('class', 'button')
  .attr('id', 'button-refresh')
  .style('background-color', 'transparent')
  .style('border', 'none')
  .append('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .attr('width', '32')
  .attr('height', '32')
  .attr('viewBox', '0 0 1024 1024');

btnR.append('path')
  .attr('id', 'svg-path')
  .attr('fill', 'black')
  .attr('d', 'M511.28 0C255.472 0 47.36 208.126 47.36 463.934c0 240.448 185.296 441.536 423.568 462.096l-91.856 46.56c-11.344 6.223-18.096 20.223-11.376 31.279l3.248 8.4c6.752 11.056 21.376 14.976 32.687 8.783l153.312-78.496c.193-.128.4-.095.593-.223l10.288-5.632c5.68-3.12 9.44-8.224 10.943-13.903c1.569-5.68.85-12-2.527-17.504l-6.096-10c-.095-.193-.288-.32-.4-.496L475.055 746.83c-6.72-11.056-21.311-14.976-32.687-8.784l-7.44 5.184c-11.344 6.192-12.096 22.192-5.376 33.217l55.872 86.672c-.304-.016-.576-.128-.865-.144c-209.28-13.727-373.2-189.039-373.2-399.039C111.36 243.408 290.767 64 511.28 64c220.544 0 400.96 179.408 400.96 399.937c0 126.976-58.32 243.6-160 319.968c-14.127 10.624-16.975 30.689-6.367 44.817c10.624 14.16 30.689 16.976 44.817 6.368c117.936-88.592 185.567-223.872 185.567-371.152C976.24 208.129 767.105 0 511.28 0');

btnR.on('mouseover', () => btnR.select('#svg-path').attr('fill', 'red'));
btnR.on('mouseout', () => btnR.select('#svg-path').attr('fill', 'black'));

  const btnD = subContainer.append('button')
  .attr('class', 'button')
  .attr('id', 'button-download')
  .style('background-color','transparent')
  .style('border','none')
  .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', '32')
    .attr('height', '32')
    .attr('viewBox', '0 0 1024 1024');

btnD.append('path')
  .attr('id', 'svg-path')
  .attr('fill', 'black')
  .attr('d', 'M960 79.904H64c-35.184 0-64 28.816-64 64v736.192c0 35.184 28.816 64 64 64h896c35.184 0 64-28.816 64-64V143.904c0-35.184-28.816-64-64-64zm0 800.193l-895.999-.001v-188.56l256.848-248.912L585.633 707.12c10.912 13.248 30.336 11.568 44.128 1.12l116.88-105.808l210.8 216.384c.8.8 1.695 1.391 2.56 2.08v59.2zm.001-150.305L771.97 537.376c-11.408-11.248-29.28-12.4-41.937-2.752l-120.56 105.024l-264.943-262.08a32.09 32.09 0 0 0-22.688-11.6c-8.816-.32-17.505 2.56-23.969 8.624l-233.872 227.6V143.904h896v585.888zM736.002 400.128c35.28 0 63.84-28.608 63.84-63.84c0-35.217-28.56-63.825-63.84-63.825s-63.84 28.608-63.84 63.824c0 35.233 28.56 63.841 63.84 63.841z');
  const name = this.container
btnD.on('mouseover', () => btnD.select('#svg-path').attr('fill', 'red'));
btnD.on('mouseout', () => btnD.select('#svg-path').attr('fill', 'black'));
btnD.on('click', function() {

  const svgElement = d3.selectAll('#svg_container')
  .filter(function () {
    return d3.select(this).attr('graph') === name;
  });
  test(svgElement.node());

});


    const config = {
      container: subContainer,
      margin: { top: 20, right: 20, bottom: 30, left: 40 },
      categories: 3*this.data.length,
      dimensions: this.keys,
      width: 7000,
      height: 400,
      total: this.data.length,
      nodeWidth: 10
    }

    // Call Plot
    const plot = Pcp()
      .container(config.container)
      .width(config.width)
      .height(config.height)
      .margin(config.margin)
      .xScale((1000), config.dimensions)
      .colors(['#da1e37', '#006466', 'yellow'])
      .numberOfCategories(config.categories)
      .nodeWidth(config.nodeWidth)
      .data(this.data)
      .dimensions(config.dimensions)
      .total(config.total)
      .allowTooltip(true)
      .draggable(true)
      .tableData(false)

    plot(subContainer)


    // Change colors of nodes
    const selectColorsNode = d3.select('#content-selector-col-nodes')
    selectColorsNode.on('change', function () {
      const selectedValue = d3.select(this).property('value')
      let col = []

      if (selectedValue === 'option1') {
        col = ['#da1e37', 'green', 'orange']
      } else if (selectedValue === 'option2') {
        col = ['black', 'grey', 'darkblue']
      } else if (selectedValue === 'option3') {
        col = ['purple', 'gray', 'green']
      }
      plot.colors(col)()
  
    })

    // Change path color
    const selectColorPath = d3.select('#content-selector-col-paths')
    selectColorPath.on('change', function () {
      const selectedValue = d3.select(this).property('value')
     let col;
      const cont = this.container;

      if (selectedValue === 'opt1') {
        col = 'black'
      } else if (selectedValue === 'Grey') {
        col = 'grey'
      } else if (selectedValue === 'Yellow') {
        col = 'yellow'
      } else if (selectedValue === 'Blue') {
        col = '#505D75'
      }
      plot.pathColors(col)()

    })

    this.removeElementListener(plot, subContainer)
    this.addElementListener(plot, subContainer)
    this.scaling(plot, subContainer)
  }

  scaling(plot, container) {

    const slider = d3.select(`#slider-${this.container}`)
    const containerValue = this.container // Stock valeur de this.container

    slider.on('input', function () {
      const value = this.value
      plot.rescale(value, containerValue,container)
    })
  }

  removeElementListener(plot, container) {
    const containerValue = this.container // Stock valeur de this.container

    const removeEvent = d3.selectAll(`#${this.container}.checkbox-group`)
    removeEvent.on('click', (event, d) => {
      this.addObjet(d)
      plot.transition(containerValue)
    })
  }
  addElementListener(plot, container) {

    const self = this; 
  
    const elements = d3.selectAll(`#selector-${this.container}`);
    const containerValue = this.container;
  
    elements.on('click', function () {
      const selectedObject = d3.select(this.options[this.selectedIndex]).datum();
      const selectedOption = this.options[this.selectedIndex];
      const selectedValue = selectedOption.value;
  
      self.hiddenElement = self.hiddenElement.filter(el => el.name !== selectedValue);
  
      d3.select(selectedOption).remove();
      plot.render(selectedObject, container);
      
  
    });
  }
  

}

// https://elliotbentley.com/blog/a-better-way-to-structure-d3-code-es6-version/
// https://www.youtube.com/watch?v=hut5-CIt_ks
// https://observablehq.com/@yeqingh/d3-parallel-coordinates
// construct with classes : https://gist.github.com/ejb/774b87bf0f7482599419d1e7da9ed918
// drag lines : https://stackoverflow.com/questions/42720488/d3-v4-drag-line-chart-with-x-and-y-axes
// move axis : https://codepen.io/BHouwens/pen/RaeGVd
