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

    var margin = {top: 50, right: 10, bottom: 30, left: 50},
    width = 450 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
            .attr("transform", "translate(5)rotate(0)")
            .style("text-anchor", "end");
  
    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 6000])
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
    .attr("stroke", "green");

    const pieData = [
        { "type": "Movie", "count": counts["Movie"] },
        { "type": "TV Show", "count": counts["TV Show"] }
    ];

    var width = 260;
    var height = 300;
    var radius = Math.min(width, height) / 2;

    var svg = d3.select("#pieChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal()
        .domain(pieData.map(function(d) { return d.type; }))
        .range(["red", "black"]); // Color scale for Movie and TV Show

    var pie = d3.pie()
        .value(function(d) { return d.count; });

    var data_ready = pie(pieData);

    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d) { return (color(d.data.type)); })
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d) { return (d.data.type + ": " + d3.format(".1%")(d.data.count / d3.sum(pieData, function(d) { return d.count; }))); })
        .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
        .style('text-anchor', 'middle')
        .style('fill', 'white');
});

var rowConverter = function(d) {
    return {
        country: String(d["country"]),
        title: String(d["title"])
    };
};

d3.csv("netflix_titles_cleaned.csv", rowConverter).then(function(data) {
    var counts = {};
    data.forEach(function(d) {
        if (!counts[d.country]) {
            counts[d.country] = 0;
        }
        counts[d.country]++;
    });

    var countData = Object.keys(counts).map(function(key) {
        return {
            country: key,
            count: counts[key]
        };
    });
    countData.sort(function(a, b) {
        return b.count - a.count;
    });

    // Slice the first 10 elements
    countData = countData.slice(0, 10);

    var width = 500;
    var height = 500;
    var margin = { top: 20, right: 70, bottom: 50, left: 90 };

    var svg = d3.select("#barchart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scaleBand()
        .range([0, height])
        .domain(countData.map(function(d) { return d.country; }))
        .padding(0.1);
    svg.append("g")
        .call(d3.axisLeft(y));

    var colorScale = d3.scaleSequential()
        .domain([d3.min(countData, function(d) { return d.count; }), d3.max(countData, function(d) { return d.count; })])
        .interpolator(d3.interpolateReds);

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(countData, function(d) { return d.count; })]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.selectAll(".bar")
        .data(countData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function(d) { return y(d.country); })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function(d) { return x(d.count); })
        .attr("fill", function(d) { return colorScale(d.count); });

    svg.selectAll(".text")
        .data(countData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function(d) { return x(d.count) + 5; })
        .attr("y", function(d) { return y(d.country) + y.bandwidth() / 2; })
        .attr("dy", ".35em")
        .attr("fill", "pink")
        .text(function(d) { return d.count; });

    svg.selectAll("g g.tick text")
        .attr("fill", "Ivory");
    svg.selectAll("g g.tick line")
        .attr("stroke", "red");
    svg.selectAll("g path.domain")
        .attr("stroke", "green");

}).catch(function(error) {
    console.log(error);
});
