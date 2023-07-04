export class DataTable {
    constructor(data, columns,id) {
      this.id = id;
      this.data = data;
      this.columns = columns;
      this.removedColumns = [];
    }

    /**
     * used when columns need to be reodered
     * @param {*} columns 
     */
    reorder(columns) {
      console.log('colonnes dans table : ' + columns)
        this.columns = columns;
      
        const table = d3.select("#table-" + this.id);
      
        const headerRow = table.select("thead tr");
      
        headerRow
          .selectAll("th")
          .data(this.columns, column => column)
          .order() 
          .text(column => column);
      
        const dataRows = table.select("tbody").selectAll("tr");
      
        dataRows
          .selectAll("td")
          .data(d => this.columns.map(column => d[column])) 
          .order() 
          .text(d => d);
      }
      
    resume() {
        const count = this.data.reduce((acc, obj) => {
          Object.entries(obj).forEach(([key, value]) => {
            const keyCount = `${key}-${value}`;
            const currentCount = acc.get(keyCount) || 0;
            acc.set(keyCount, currentCount + 1);
          });
          return acc;
        }, new Map());
      
        
        
        const columns =this.columns;
      
        const summaryTable = d3.create("table");
        const thead = summaryTable.append("thead");
        const tbody = summaryTable.append("tbody");
        
        thead.append("tr")
          .selectAll("th")
          .data(["occ / name ", ...columns])
          .join("th")
          .text(d => d);

          const rows = tbody.selectAll("tr")
            .data(count)
            .join("tr");
          
          rows.append("td")
            .text(d => console.log(d));
          
        //   rows.selectAll("td.data-cell")
        //     .data(d => columns.map(key => d[columns] || 0))
        //     .join("td")
        //     .attr("class", "data-cell")
        //     .text(d => d);
          
          document.body.appendChild(summaryTable.node());
      }
      
      
      
    
    remove(columnName) {
        const columnIndex = this.columns.findIndex(col => col.toLowerCase() === columnName.toLowerCase());
        const table = d3.select("#table-" + this.id);
        
        if (columnIndex !== -1) {
          const removedElements = table.selectAll(`tbody tr td:nth-child(${columnIndex + 1})`).nodes();
          const removedData = removedElements.map(element => d3.select(element).datum());
          
          table.selectAll(`thead tr th:nth-child(${columnIndex + 1})`).remove();
          table.selectAll(`tbody tr td:nth-child(${columnIndex + 1})`).remove();
          
    const current = { colname: columnName, data: removedData };
    this.removedColumns.push(current);
    this.columns = this.columns.filter(col => col.toLowerCase() !== columnName.toLowerCase());
            }
      }
      
      add(columnName) {
        const columnIndex = this.columns.length; 
        this.columns.push(columnName);
        const table = d3.select("#table-" + this.id);
        const headerRow = table.select("thead tr");
        headerRow.append("th").text(columnName);
        const current = this.removedColumns.find(col => col.colname === columnName); 
        const rows = table.select("tbody").selectAll("tr");
        rows.each(function(d, i) {
          const row = d3.select(this);
          const cellValue = current.data[i]; 
          row.append("td").text(cellValue);
        });
      }
    

    /**
     * Create table
     */
    createTable() {
        
        const index = this.id;
        const bottom = d3.select("#bottom");
        const tabList = d3.select(".tab-list")
        const tabContents = d3.select(".tab-contents");
        const tabContent = tabContents.append("div").classed("tab-content", true).attr("id", "tab-" + this.id);
        
        const table = tabContent.append("table").attr("id", "table-" + index);
        const thead = table.append("thead");
        const tbody = table.append("tbody");
        
      thead
        .append("tr")
        .selectAll("th")
        .data(this.columns)
        .enter()
        .append("th")
        .text(column => column);
  
      const rows = tbody
        .selectAll("tr")
        .data(this.data)
        .enter()
        .append("tr");
  
      rows
        .selectAll("td")
        .data(d => Object.values(d))
        .enter()
        .append("td")
        .text(d => d);
  
      tabList
        .append("li")
        .attr('id',"tab-" + index)
        .text(`Table ${this.id}`)
        .on("click", function() {
            const alltab = d3.selectAll('.tab-list li');
            alltab.classed("active", false);
            const allContent = d3.selectAll('.tab-content').classed("active", false);
            const current = d3.select(this).classed("active", true);
            const content = d3.select(".tab-contents #tab-" + index).classed("active", true);
          });
          //this.resume()
     }
    
  }
  