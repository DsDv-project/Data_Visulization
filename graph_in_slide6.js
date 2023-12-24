// Define your data
var data = [ //US
    {genre: "Dramas, International Movies", count: 26},
    {genre: "Documentaries", count: 265},
    {genre: "Stand-Up Comedy", count: 240}
];
var data1 = [ //UK
    {genre: "Dramas, International Movies", count: 7},
    {genre: "Documentaries", count: 40},
    {genre: "Stand-Up Comedy", count: 18}
];
var data2 = [ // India
    {genre: "Dramas, International Movies", count: 118},
    {genre: "Documentaries", count: 0},
    {genre: "Stand-Up Comedy", count: 6}
];

// Set the dimensions of the canvas
var margin = {top: 20, right: 20, bottom: 70, left: 60},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Define the scales
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    yScale = d3.scaleLinear().range([height, 0]),
    colorScale = d3.scaleLinear().range(["#ffcccc", "#cc0000"]);

// Define the axes
var xAxis = d3.axisBottom(xScale),
    yAxis = d3.axisLeft(yScale);

// Create the SVG container
var svg = d3.select("#graph6")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const select = d3.select("#selectCountry");
select.on("change", function () {
    updateData();
});

function updateData() {
    const criterion = select.node().value;
    let updatedData;

    if (criterion === "US") {
        updatedData = data;
    } else if (criterion === "UK") {
        updatedData = data1;
    } else if(criterion === "India") {
        updatedData = data2;
    }

    // Update the scales
    xScale.domain(updatedData.map(d => d.genre));
    yScale.domain([0, d3.max(updatedData, d => d.count)]);
    colorScale.domain([0, d3.max(updatedData, d => d.count)]);

    // Remove the existing bars and text labels
    svg.selectAll("rect").remove();
    svg.selectAll("text").remove();

    // Create the bars
    svg.selectAll("rect")
        .data(updatedData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.genre))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.count))
        .attr("fill", d => colorScale(d.count));

    // Add text labels
    svg.selectAll("text")
        .data(updatedData)
        .enter()
        .append("text")
        .text(d => d.count)
        .attr("x", d => xScale(d.genre) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.count) + 14)
        .attr("font-family", "sans-serif")
        
        .attr("font-size", "15px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");

    // Add the axes
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "4em")
        .attr("dy", "1em")
        .style("fill", "white")
        .style("font-size", "15px")
        .attr("transform", "rotate(0)");

    svg.append("g")
        .call(yAxis);

    // Add labels
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 -50)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Count");

    svg.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Genre");
}

// Call updateData initially to draw the graph
updateData();