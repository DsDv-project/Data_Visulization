var rowConverter = function(d) {
    return {
        country: String(d["country"]),
        type: String(d["type"]) // Assuming your CSV has a "type" column with values "TV Show" or "Movie"
    };
};

d3.csv("netflix_titles_cleaned.csv", rowConverter).then(function(data) {
    var counts = {};
    data.forEach(function(d) {
        if (!counts[d.country]) {
            counts[d.country] = { "TV Show": 0, "Movie": 0 };
        }
        counts[d.country][d.type]++;
    });

    var countData = Object.keys(counts).map(function(key) {
        return {
            country: key,
            "TV Show": counts[key]["TV Show"],
            "Movie": counts[key]["Movie"]
        };
    });

    // Sort and slice the data
    countData.sort(function(a, b) {
        return (b["TV Show"] + b["Movie"]) - (a["TV Show"] + a["Movie"]);
    });
    countData = countData.slice(0, 3);

    // Create stack with "TV Show" on top and "Movie" at the bottom
    var stack = d3.stack()
        .keys(["Movie", "TV Show"]);
    var series = stack(countData);
    updateData();

    const button = d3.select("#button");
    button.on("click", function() {
        countData = countData.slice(0, 3);
        updateData();
    });

    function updateData() {
        d3.select("#graph5").select("svg").remove();

        var width = 800;
        var height = 700;
        var margin = { top: 35, right: 70, bottom: 50, left: 500 };

        var svg = d3.select("#graph5")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Prepare data for stacking
        var stack = d3.stack().keys(["Movie", "TV Show"]);
        var stackedData = stack(countData);

        var x = d3.scaleBand()
            .range([0, width])
            .domain(countData.map(function(d) { return d.country; }))
            .padding(0.1);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var color = d3.scaleOrdinal()
            .domain(["TV Show", "Movie"])
            .range(["#221f1f", "#b20710"]);

        var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(stackedData, function(d) { return d3.max(d, function(d) { return d[1]; }); })]);
        svg.append("g")
            .call(d3.axisLeft(y));


        // Add a tooltip
        var tooltip = d3.select("#graph5")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("color", "white");

        // Create stacked bars
        svg.selectAll(".bar")
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data.country); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .on("mouseover", function(event, d) {
                var key = d3.select(this.parentNode).datum().key; // Get the key from the parent group
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                    tooltip.html("<span style='color: blue;'>" + d.data.country + "</span><br/>Type: " + key + "<br/>Count: " + (d[1] - d[0]));
                    
            })
            
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            });

        svg.selectAll(".text")
            .data(countData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", function(d) { return x(d.country) + x.bandwidth() / 2; })
            .attr("y", function(d) { return y(d["TV Show"] + d["Movie"]) - 5; })
            .attr("dy", "-0.7em")
            .attr("fill", function(d) { return (d["TV Show"] + d["Movie"] > 0) ? "white" : "black"; })
            .attr("text-anchor", "middle")
            .text(function(d) { return d["TV Show"] + d["Movie"]; });

        svg.selectAll("g g.tick text")
            .style("font-size", "20px")
            .attr("fill", "Ivory");
        svg.selectAll("g g.tick line")
            .attr("stroke", "#b20710");
        svg.selectAll("g path.domain")
            .attr("stroke", "white");

        // Add a title to the chart
        svg.append("text")
            .attr("x", width/ 1.7)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "25px")
            .style("text-decoration", "underline")
            .attr("fill", "white")
            .text("Number of Movies vs Number of TV Shows for US, India, and UK");

        // Add legend
        var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("fill", "white")
        .attr("transform", function(d, i) { return "translate(0," + i * 28 + ")"; });

        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
    }
}).catch(function(error) {
    console.log(error);
});
