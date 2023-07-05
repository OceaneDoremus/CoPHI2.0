import { Reader } from "./Reader.mjs"
export function main() {
  console.log("hello world");
  getFiles();

}
/// UTILS ////
function hide(el) {
  el.style("display", "none");
}

function show(el) {
  el.style("display", "block");
}

function isVisible(el) {
  const isVisible = el.style("display") !== "none";
  if (isVisible) {
    hide(el);
  } else {
    show(el);
  }
}

function startVisualization() {
  // Hide Start Element
  const el = d3.select(".card");
  isVisible(el);

}

function getFiles() {
  const files = document.getElementById('files').files;
  if (files.length === 0) {
    alert("Aucun fichier sélectionné !");
    return; // Sortir de la fonction pour éviter la création de l'instance Reader
  }
  startVisualization();
  const read = new Reader(files);
 
}

