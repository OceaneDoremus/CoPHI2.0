export class Data {
  constructor(inputData, container, columns) {
    this.inputData = inputData;
    this.container = container;
    this.columns = columns;
    this.originalData = this.inputData;
    console.log("ori",this.originalData);
    this.initData(this.inputData);
  }

  batchProcess(data, batchSize) {
    const nbBatch = Math.ceil(data.length / batchSize);

    for (let i = 0; i < nbBatch; i++) {
      const debutIndex = i * batchSize;
      const finIndex = (i + 1) * batchSize;
      const batch = data.slice(debutIndex, finIndex);

      for (let j = 0; j < batch.length; j++) {
        const obj = batch[j];
        for (let key in obj) {
          const value = Number(obj[key]);
          obj[key] = value === 0 ? 0 : value >= 1 ? 1 : value < 0 ? 2 : undefined;

        }
      }
    }
  }
  addNullReaction(inputData, newCols) {
    if (newCols.length) {
      const existingColumns = Object.keys(inputData[0]);

      const uniqueNewCols = newCols.filter(
        (col) => !existingColumns.includes(col)
      );

      inputData.forEach(function (obj) {
        uniqueNewCols.forEach(function (col) {
          obj[col] = 0;
        });
      });

      const updatedColumns = [...existingColumns, ...uniqueNewCols];

      inputData.columns = updatedColumns;
    }

    return inputData;
  }

  sortColumns(el) {
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
      columns: sortedColumns,
    };

    return result;
  }

  initData(inputData) {
    this.batchProcess(inputData, 1000);
    let newData = this.addNullReaction(inputData, this.columns);
    let d = this.sortColumns(newData);
    let lines = d;
    let keys = d.columns;
  }
}
