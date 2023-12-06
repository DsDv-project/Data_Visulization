d3.csv("netflix_titles_cleaned.csv").then(function(data) {
    const counts = {
        "Movie": 0,
        "TV Show": 0,
    };
    data.forEach(function(d) {
        if (d.type === "Movie") {
            counts["Movie"] += 1;
        } else {
            counts["TV Show"] += 1;
        }
    });

    const barData = [
        { "type": "Movie", "count": counts["Movie"] },
        { "type": "TV Show", "count": counts["TV Show"] }
    ];

    const margin = {top: 50, right: 10, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    var svg = d3.select("#graph1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top  + ")");
    
    // X axis
    var x = d3.scaleBand()
    .range([0, width])
    .domain(["Movie", "TV Show"]) // Update X-axis domain
    .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(15,5)rotate(0)")
            .style("font-size", "25px")
            .style("text-anchor", "end");
  
    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.count)*1.2]) // Set the upper limit to the max count
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
            .style("font-size", "17px");
  
    // Bars
    svg.selectAll("mybar")
    .data(barData) // Use barData here
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d.type); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); })
        .attr("fill", function(d) { 
            if (d.type === "Movie") {
                return "red"; 
            } else {
                return "black"; 
            }
        });

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", -25)
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style("text-decoration", "bold")  
        .attr("fill", "white")
        .text("Number of Movies and TV Shows on Netflix");

    svg.selectAll("g g.tick text")
        .attr("fill", "Ivory");
    svg.selectAll("g g.tick line")
        .attr("stroke", "red");
    svg.selectAll("g path.domain")
        .attr("stroke", "green")
        .attr("stroke-width", 3);

}).catch(function(error) {
    console.log(error);
});