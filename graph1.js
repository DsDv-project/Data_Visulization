var data = [
    {year: 2011, users: 21.5},
    {year: 2012, users: 25.7},
    {year: 2013, users: 35.6},
    {year: 2014, users: 47.9},
    {year: 2015, users: 62.7},
    {year: 2016, users: 79.9},
    {year: 2017, users: 99},
    {year: 2018, users: 124.3},
    {year: 2019, users: 151.5},
    {year: 2020, users: 192.9}
];var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 900 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var svg = d3.select("#graph1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
  .domain(d3.extent(data, function(d) { return d.year; }))
  .range([ 0, width ]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickFormat(d3.format("d")));

var y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.users; })])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "red")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.year) })
    .y(function(d) { return y(d.users) })
  )

svg.append("g")
    .attr("transform", "translate(0," + height +")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))
    .selectAll("text, line") 
    .attr("stroke", "white")
    .style("font-size", "16px")
    .attr("fill", "white"); 

svg.selectAll(".domain")
    .attr("stroke", "white");


svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text, line") 
    .attr("stroke", "white")
    .style("font-size", "16px") 
    .attr("fill", "white");

svg.selectAll(".domain")
    .attr("stroke", "white");