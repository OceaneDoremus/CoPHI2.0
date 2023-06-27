import { Chart } from "./Chart.mjs";
export class Data {
    constructor(inputData , container,columns) {
        this.inputData = inputData;
        this.container=container;
        this.columns=columns;
        this.initData(this.inputData);
    } 


    traiterParLot(data, tailleLot) {
        const nombreLots = Math.ceil(data.length / tailleLot);
      
        for (let i = 0; i < nombreLots; i++) {
          const debutIndex = i * tailleLot;
          const finIndex = (i + 1) * tailleLot;
          const lot = data.slice(debutIndex, finIndex);
      
         
          for (let j = 0; j < lot.length; j++) {
            const obj = lot[j];
            for (let key in obj) {
              const value = Number(obj[key]);
              obj[key] = value === 0 ? 0 : (value >= 1 ? 1 : 2)

            }
            }
          console.log('lot : ', i + 1, ':', lot);
        }
  }
  addNullReaction(inputData, newCol) {
 
    
    var newArr = [];
    
    if (newCol.length) {
      inputData.forEach(function(obj) {
        newCol.forEach(function (e){
          obj[e] = 0;
        })
       
    });

    }

    return inputData;
  }
  
   
    initData(inputData) {
        console.log("[-- DATA INITIALIZATION --]");
console.log(this.inputData)
        this.traiterParLot(inputData, 1000);
        console.log("inputdata : ", inputData);
       let newData =  this.addNullReaction(inputData,this.columns);
        let lines = newData;
        let keys = newData.columns.slice(0);

       let chart = new Chart(this.container,newData, lines, keys);
    }

}