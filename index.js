let graph = null;

const pointsInput = document.getElementById("points");
pointsInput.addEventListener("input", drawGraph);

const multiplierInput = document.getElementById("multiplier");
multiplierInput.addEventListener("input", drawGraph);

const colorInput = document.getElementById("color");
colorInput.addEventListener("input", () => {
  graph
    .style()
    .selector("node")
    .style("background-color", colorInput.value)
    .selector("edge")
    .style("line-color", colorInput.value)
    .update();
});

multiplierInput.dispatchEvent(new Event("input"));
function drawGraph() {
  const points = +pointsInput.value;
  const multiplier = +multiplierInput.value;
  const color = colorInput.value;

  document.querySelector('label[for="points"] span').innerHTML =
    pointsInput.value;
  document.querySelector('label[for="multiplier"] span').innerHTML =
    multiplierInput.value;

  graph = cytoscape({
    container: document.getElementById("graph"),
    layout: { name: "circle" },
    userPanningEnabled: false,

    elements: {
      nodes: [...Array(points)].map((_, i) => ({
        data: { id: `${i}` },
        grabbable: false,
      })),

      edges: [
        ...new Set(
          [...Array(points)].map((_, i) =>
            [i, (multiplier * i) % points].sort().join(",")
          )
        ),
      ]
        .map((edge) => edge.split(","))
        .filter(([s, t]) => s !== t)
        .reduce(
          (set, [source, target]) => [...set, { data: { source, target } }],
          []
        ),
    },

    style: [
      {
        selector: "node",
        style: {
          "background-color": color,
        },
      },

      {
        selector: "edge",
        style: {
          width: 10,
          "line-color": color,
          "target-arrow-shape": "none",
          "curve-style": "bezier",
        },
      },
    ],
  });
}

document.querySelector("button").addEventListener("click", () => {
  const png64 = graph.png();

  const a = document.createElement("a");
  a.href = png64;
  a.download = `${multiplierInput.value}_times_table_${pointsInput.value}pts.png`;
  a.click();
});
