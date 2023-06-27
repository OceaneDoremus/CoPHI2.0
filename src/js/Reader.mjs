import { Data } from "./Data.mjs"
export class Reader {
    constructor(inputData, container) {
        this.inputData = inputData;
        this.container = container;
        this.uploadData();
    }

    uploadData() {
      console.log("[-- START READING FILES --]");
      console.log(this.inputData);
      const files = Array.from(this.inputData); 
    
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function (e) {
            const content = e.target.result;
            console.log("[-- FILE LOADED --]");
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
            new Data(inputData, "graph_0", []);
          } else if (contents.length <= 4) {
            this.compare(contents);
          } else {
            console.error("Only 1 to 4 files are supported.");
          }
        })
        .catch((error) => {
          console.error("Erreur de lecture des fichiers:", error);
        });
    }
    
    compare(contents) {
      let columnsList = [];
      const parsedData = contents.map((content) => d3.csvParse(content));
      parsedData.forEach((element) => {
        columnsList.push(element.columns);
      });
    
      for (let i = 0; i < contents.length; i++) {
        let extraColumns = [];
        for (let j = 0; j < contents.length; j++) {
          if (j !== i) {
            extraColumns = extraColumns.concat(columnsList[j].filter(item => !columnsList[i].includes(item)));
          }
        }
        new Data(parsedData[i], `graph_${i}`, extraColumns);
      }
    }
    
  
  
}
