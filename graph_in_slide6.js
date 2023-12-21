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
var width = 800,
         height = 600,
         barPadding = 10;

// Create the SVG container
var svg = d3.select("#graph6")
                                .append("svg")
                                .attr("width", width)
                                .attr("height", height);

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

    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(updatedData, d => d.count)])
                    .range([height, 0]);
                     
    var colorScale = d3.scaleLinear()
                    .domain([0, d3.max(updatedData, d => d.count)])
                    .range(["#ffcccc", "#cc0000"]);                    

    // Remove the existing bars and text labels
    svg.selectAll("rect").remove();
    svg.selectAll("text").remove();

    // Create the bars
    svg.selectAll("rect")
        .data(updatedData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * (width / updatedData.length))
        .attr("y", d => yScale(d.count))
        .attr("width", width / updatedData.length - barPadding)
        .attr("height", d => height - yScale(d.count))
        .attr("fill", d => colorScale(d.count));

    // Add text labels
    svg.selectAll("text")
        .data(updatedData)
        .enter()
        .append("text")
        .text(d => d.count)
        .attr("x", (d, i) => i * (width / updatedData.length) + (width / updatedData.length - barPadding) / 2)
        .attr("y", d => yScale(d.count) + 14)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");
}

// Call updateData initially to draw the graph
updateData();