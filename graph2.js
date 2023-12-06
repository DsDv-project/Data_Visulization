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

    const pieData = [
        { "type": "Movie", "count": counts["Movie"] },
        { "type": "TV Show", "count": counts["TV Show"] }
    ];
    

    var width = 500;
    var height = 500;
    var radius = Math.min(width, height) / 2;

    var svg = d3.select("#graph2")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal()
        .domain(pieData.map(function(d) { return d.type; }))
        .range(["red", "black"]);

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


}).catch(function(error) {
    console.log(error);
});