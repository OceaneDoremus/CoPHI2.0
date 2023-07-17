export function createTooltip(event, info) {

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .classed("tooltip", true)
    .style("position", "absolute")
    .style("left", event.pageX + 20 + "px")
    .style("top", event.pageY + 20 + "px")
    .attr("white-space", "pre-line")
    .style("display", "block")
    .style("padding", "10px");
  tooltip.html(info);
}

export function getPaths(s) {

  const selection = d3.selectAll(".background path");

  selection.nodes().filter(function (p) {
    return d3.select(p).attr("graphPosition") === s;
  });

  const filteredNodes = selection.nodes();

  return filteredNodes;
}

export function currentElement(selection, name) {

  const paths = getPaths(selection);

  paths.filter((path) => path.getAttribute("id") === name);
  return paths.filter((path) => path.getAttribute("id") === name);
}

export function findDescendants(selection, IdValue) {
  const paths = getPaths(selection);

  const result = [];
  const visitedPaths = new Set();

  function traverseDescendants(pathId) {
    const matchingPaths = paths.filter(
      (path) => path.getAttribute("id") === pathId
    );

    matchingPaths.forEach((path) => {
      const childIds = path.getAttribute("child").split(" ");

      childIds.forEach((childId) => {
        if (!visitedPaths.has(childId)) {
          visitedPaths.add(childId);
          result.push(
            ...paths.filter((path) => path.getAttribute("id") === childId)
          );
          traverseDescendants(childId);
        }
      });
    });
  }

  traverseDescendants(IdValue);
  return result;
}
export function findAncestors(selection, childValue, result = [], cache = {}) {
  const paths = getPaths(selection);

  if (cache[childValue]) {
    return cache[childValue];
  }

  const matchingPaths = paths.filter(
    (path) => path.getAttribute("child") === childValue
  );

  result.push(...matchingPaths);

  matchingPaths.forEach((path) => {
    const parentId = path.id;
    findAncestors(selection, parentId, result, cache);
  });

  cache[childValue] = result;

  return result;
}
