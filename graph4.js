// Your data
var US = [{Age: "Kids", count : 9}, {Age: "OlderKids", count : 20}, {Age: "Teen", count : 25}, {Age: "Adults", count : 46}];
var India = [{Age: "Kids", count : 2}, {Age: "OlderKids", count : 16}, {Age: "Teen", count : 56}, {Age: "Adults", count : 26}];
var UK = [{Age: "Kids", count : 8}, {Age: "OlderKids", count : 18}, {Age: "Teen", count : 21}, {Age: "Adults", count : 53}];

// Define the dimensions of the chart
var width = 400;
var height = 400;
var radius = Math.min(width, height) / 2;

// Define the color scale
var color = d3.scaleSequential(d3.interpolateReds).domain([0,3]);

// Define the pie layout
var pie = d3.pie().value(function(d) { return d.count; });

// Define the arc for the donut chart
var arc = d3.arc().innerRadius(radius - 90).outerRadius(radius);

// Create an SVG for each country
var svgUS = d3.select("#graph4").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var svgIndia = d3.select("#graph4_2").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var svgUK = d3.select("#graph4_3").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create the donut chart for each country
createDonutChart(svgUS, US);
createDonutChart(svgIndia, India);
createDonutChart(svgUK, UK);


var tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("z-index", "100")
    .style("visibility", "hidden")
    .style("background", "#ffffff")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

function createDonutChart(svg, data) {
    var ageToNumber = {"Kids": 0, "OlderKids": 1, "Teen": 2, "Adults": 3};
    var g = svg.selectAll(".arc")
        .data(pie(data))
    .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(ageToNumber[d.data.Age]); })
        .on("mouseover", function(d) {      
            tooltip.html("Age: " + d.data.Age + "<br> Count: " + d.data.count)
                .style("visibility", "visible");
        })
        .on("mouseover", function(event, d) {      
            tooltip.html("Age: " + d.data.Age + "<br> Count: " + d.data.count + "%")
                .style("visibility", "visible");
        })
        .on("mousemove", function(event) {
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.Age; });
}

