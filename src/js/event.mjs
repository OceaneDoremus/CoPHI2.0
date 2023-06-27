//import { saveAs } from "./file-saver";
export function test(svgElement) {
   
    const svgWidth = 7000;
    const svgHeight = 550;
    const canvas = document.createElement('canvas');
    canvas.width = svgWidth;
    canvas.height = svgHeight;
    const context = canvas.getContext('2d');
  
   
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const image = new Image();
    image.onload = function() {
      context.drawImage(image, 10, 10, svgWidth, svgHeight);
  
      canvas.toBlob(function(blob) {
        saveAs(blob, 'graph.png');
      });
    };
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  }
  