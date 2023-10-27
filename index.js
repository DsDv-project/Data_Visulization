d3.csv("netflix_titles.csv").then(function(data) {
    const counts = {
        "Movie": 0,
        "TV Show": 0
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

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    var svg = d3.select("#barChart")
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
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
  
    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 13000])
    .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
  
    // Bars
    svg.selectAll("mybar")
    .data(barData) // Use barData here
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d.type); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); })
        .attr("fill", "red");

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 100)
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style("text-decoration", "bold")  
        .attr("fill", "white")
        .text("Number of Movies and TV Shows on Netflix");

});
