import { Reader } from "./Reader.mjs";

// function used to start the visualization processing
export function main() {
  getFiles();
}
// function used to hide a DOM element
function hide(el) {
el.style("display", "none");
}
// function used to show a DOM element
function show(el) {
  el.style("display", "block");
}
// function used to check if a DOM element is visible or not
function isVisible(el) {
  const isVisible = el.style("display") !== "none";
  if (isVisible) {
    hide(el);
  } else {
    show(el);
  }
}
// function used to hide card element containing the file(s)
function startVisualization() {
  const el = d3.select(".card");
  isVisible(el);
}
// function used to get the files from the input
function getFiles() {
  const files = document.getElementById("files").files;
  if (files.length === 0) {
    alert("No file(s) selected !");
    return; 
  }
  startVisualization();
  console.log(files)
  const reader = new Reader(files);
}
