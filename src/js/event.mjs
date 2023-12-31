
/** @author Océane Dorémus
 * source(s) : 
 * https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser
 * https://stackoverflow.com/questions/15547198/export-html-table-to-csv-using-vanilla-javascript
 */
export function downloadToPNG() {
  const svgElement = document.getElementById('svg_container');
  if(!svgElement){return}
  const svgRect = svgElement.getBoundingClientRect(); 
  
  const svgWidth = svgRect.width;
  const svgHeight = svgRect.height;
  const canvas = document.createElement('canvas');
  canvas.width = svgWidth;
  canvas.height = svgHeight;
  const context = canvas.getContext('2d');

  const svgString = new XMLSerializer().serializeToString(svgElement);
  const image = new Image();
  image.onload = function() {
    context.drawImage(image, 0, 0, svgWidth, svgHeight); 
    canvas.toBlob(function(blob) {
      saveAs(blob, 'graph.png');
    });
  };
  image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}
export function exportTableToCSV(e) {
  e.preventDefault();

  var tableElements = document.querySelectorAll('[id^="table-"]');
  if (!tableElements) {
    return;
  }
  var csvFiles = [];

  tableElements.forEach((table, index) => {
    var tblRows = table.querySelectorAll('tr');
    var csv = "";
    var rows = [];

    tblRows.forEach((el) => {
      var row = [];
      el.querySelectorAll('th, td').forEach((ele) => {
        var eleClone = ele.cloneNode(true);
        eleClone.innerText = eleClone.innerText.replace(/\"/gi, '\"\"');
        eleClone.innerText = '"' + eleClone.innerText + '"';
        eleClone.innerText = eleClone.innerText.replace(/2/g, '-1');
        row.push(eleClone.innerText);
      });
      rows.push(row.join(","));
    });

    csv += rows.join(`\r\n`);
    var file = new Blob([csv], { type: 'text/csv' });
    var dlAnchor = document.createElement('a');

    dlAnchor.download = "tableCsv_" + index + ".csv";
    dlAnchor.href = window.URL.createObjectURL(file);

    csvFiles.push(dlAnchor);
  });

  csvFiles.forEach((dlAnchor) => {
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
  });
}

