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
            if(contents.length >1){
            this.compare(contents);}else  {
                let inputData =  d3.csvParse(contents[0])
                new Data(inputData,"graph_0",[])
            }
          })
          .catch((error) => {
            console.error("Erreur de lecture des fichiers :", error);
          });
      }
     
    compare(contents){
       
        let columnsList = [];
        const parsedData = contents.map((content) => d3.csvParse(content));
parsedData.forEach(element => {
    columnsList.push(element.columns);

});


    var newtab1 = columnsList[0].concat(columnsList[1].filter(item => !columnsList[0].includes(item)));
   let a = columnsList[1].filter(item => !columnsList[0].includes(item))
    var newtab2 = columnsList[1].concat(columnsList[0].filter(item => !columnsList[1].includes(item)));
  let b = columnsList[0].filter(item => !columnsList[1].includes(item));
    new Data(parsedData[0],"graph_0",a);
    new Data(parsedData[1],"graph_1",b);

    
}
}
