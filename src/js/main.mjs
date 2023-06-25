import { Reader } from "./Reader.mjs"
export function main() {
  console.log("hello world");
  startVisualization();
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
function createTabs(containerId, files) {
  const container = document.getElementById(containerId);
  const tabsContainer = document.createElement("div");
  tabsContainer.classList.add("tabs-container");
  container.appendChild(tabsContainer);

  const contentsContainer = document.createElement("div");
  contentsContainer.classList.add("contents-container");
  container.appendChild(contentsContainer);

  const tabs = [];
  const contents = [];

  files.forEach((file, index) => {
    const tab = document.createElement("div");
    tab.classList.add("tab");
    tab.textContent = `File ${index + 1}`;
    tabsContainer.appendChild(tab);
    tabs.push(tab);

    const content = document.createElement("div");
    content.classList.add("content-" + index);
    content.textContent = file;
    contentsContainer.appendChild(content);
    contents.push(content);

    tab.addEventListener("click", () => {
      contents.forEach((content) => {
        content.style.display = "none";
      });

      content.style.display = "block";

      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });

      tab.classList.add("active");
    });

  });
}


function getFiles() {
  const files = document.getElementById('files').files;
  const readFiles = [];
  const read = new Reader(files);
 
}

