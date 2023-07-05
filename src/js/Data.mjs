
export class Data {
    constructor(inputData , container,columns) {
      console.log("data class")
        this.inputData = inputData;
        this.container=container;
        this.columns=columns;
        console.log(this.inputData,this.columns);
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
        }
  }
  addNullReaction(inputData, newCols) {
    if (newCols.length) {
      const existingColumns = Object.keys(inputData[0]);
  
      const uniqueNewCols = newCols.filter(col => !existingColumns.includes(col));
  
      inputData.forEach(function(obj) {
        uniqueNewCols.forEach(function(col) {
          obj[col] = 0;
        });
      });
  
      const updatedColumns = [...existingColumns, ...uniqueNewCols];
  
      inputData.columns = updatedColumns;
    }
  
    return inputData;
  }
  
  
  
  sortColumns(el){

const columns = el.columns;
const sortedColumns = columns.slice().sort();
const sortedElement = el.slice().sort((a, b) => {
for (const col of sortedColumns) {
  if (a[col] !== b[col]) {
    return a[col] < b[col] ? -1 : 1;
  }
}
return 0;
});

const result = {
data: sortedElement,
columns: sortedColumns
};

return result;  }
  
   
    initData(inputData) {

        this.traiterParLot(inputData, 1000);
        let newData =  this.addNullReaction(inputData,this.columns);
        let d = this.sortColumns(newData);
        let lines = d;
        let keys = d.columns
       
    }
}