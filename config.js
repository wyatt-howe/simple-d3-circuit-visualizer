// Forked from https://observablehq.com/@d3/sticky-force-layout@137

function* setup(d3, width, height, graph, clamp) {  // d3 canvas generator

	let svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);
	let link = svg
	  .selectAll(".link")
	  .data(graph.links)
	  .join("line");
	let node = svg
	  .selectAll(".node")
	  .data(graph.nodes)
	  .join("circle")
	  .attr("r", 12)
	  .classed("node", true)
	  .classed("fixed", d => d.fx !== undefined);

	svg.append("svg:defs")
	 .append("svg:marker")
	  .attr("id", "arrow")
	  .attr("viewBox", "0 0 10 10")
	  .attr("refX", 27)
	  .attr("refY", 5)
	  .attr("markerUnits", "strokeWidth")
	  .attr("markerWidth", 10)
	  .attr("markerHeight", 10)
	  .attr("orient", "auto")
	  .append("svg:path")
	  .attr("d", "M 0 0 L 10 5 L 0 10 z");

	link.attr('marker-end','url(#arrow)');

	link.classed("link", true);

	link.style("stroke", function(d) {
		return d.color;
	});

	node.style("fill", function(d) {
		return d.is_gate ? (/*'#CCCCCC'*/ d.color) :'#000000';
	});

	node.attr("r", function(d) {
		return d.is_gate ? 12 : 3;
	});

  yield svg.node();


  const simulation = d3
    .forceSimulation()
    .nodes(graph.nodes)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(graph.links))
    .on("tick", tick);

  const drag = d3
    .drag()
    .on("start", dragstart)
    .on("drag", dragged);

  node.call(drag).on("click", click);

  function tick() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  function click(event, d) {
    delete d.fx;
    delete d.fy;
    d3.select(this).classed("fixed", false);
    simulation.alpha(1).restart();
  }

  function dragstart() {
    d3.select(this).classed("fixed", true);
  }

  function dragged(event, d) {
    d.fx = clamp(event.x, 0, width);
    d.fy = clamp(event.y, 0, height);
    simulation.alpha(1).restart();
  }
}


function canvas_height(width) {
	return 5000;//Math.min(500, width * 0.6);
}

import circuit from "./circuit.js";

function graph() {
	return circuit;  // The circuit object has already been populated with its nodes and links and so is a graph.
}

const config = {setup, canvas_height, graph};

export default config;
