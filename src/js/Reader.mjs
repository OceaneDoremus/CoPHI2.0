/** @author Océane Dorémus
 * source(s) : 
 * https://www.aleksandrhovhannisyan.com/blog/javascript-promise-all/
 */

import { Data } from "./Data.mjs"
import { Graph } from "./Graph.mjs"
export class Reader {
    constructor(inputData, container) {
        this.inputData = inputData;
        this.container = container;
        this.uploadData();
    }

    uploadData() {
      const files = Array.from(this.inputData); 
    
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function (e) {
            const content = e.target.result;
            resolve(content); 
          };
          reader.onerror = function (e) {
            reject(e); 
          };
        });
      });
    
      Promise.all(promises)
        .then((contents) => {
          if (contents.length === 1) {
            let inputData = d3.csvParse(contents[0]);
            console.log("inpu",inputData)
         
       
            let columnsList = [];
            inputData.forEach((element) => {
              columnsList.push(element.columns);
            });
          
            let file = [];
            let el =  new Data(inputData, "graph_0", []);
            file.push(el.inputData);
             let G = new Graph(file);
             
             G.initPCP();
          } else if (contents.length <= 8) {
            this.compare(contents);
          } else {
            console.error("Only 1 to 8 files are supported");
          }
        })
        .catch((error) => {
          console.error("Error : ", error);
        });
    }

   compare(contents) {
    let files = []
    let columnsList = [];
    const parsedData = contents.map((content) => d3.csvParse(content));
    parsedData.forEach((element) => {
      columnsList.push(element.columns);
    });
  
    for (let i = 0; i < contents.length; i++) {
      let extraColumns = [];
      for (let j = 0; j < contents.length; j++) {
        if (j !== i) {
          const extraColumnsToAdd = columnsList[j].filter(item => !columnsList[i].includes(item) && !extraColumns.includes(item));
          extraColumns = extraColumns.concat(extraColumnsToAdd);
        }
      }
      let el = new Data(parsedData[i], `graph_${i}`, extraColumns);
      files.push(el.inputData);
    }
    // Create the multi-graph
    let G = new Graph(files);
    G.initPCP();
  }
  
}
