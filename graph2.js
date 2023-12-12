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
        .innerRadius(radius * 0.5)
        .outerRadius(radius*0.8);

    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d) { return (color(d.data.type)); })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", function(d) {
            d3.select(this)
                .transition() // Add this line
                .duration(100)
                .style("opacity", 1);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition() // Add this line
                .duration(100)
                .style("opacity", 0.7);
        })
        .append("title") // Tooltip
            .style("font-size", "100px")
            .text(function (d) {
                 return ("Type: " + d.data.type + "\n" + "Count: " + d3.format(".1%")(d.data.count / d3.sum(pieData, function(d) { return d.count; })));
             });

    svg.selectAll('allPolylines')
             .data(data_ready)
             .enter()
             .append('polyline')
               .attr("stroke", "black")
               .style("fill", "none")
               .attr("stroke-width", 1)
               .attr('points', function(d) {
                 var posA = arc.centroid(d) // line insertion in the slice
                 var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                 var posC = outerArc.centroid(d); // Label position = almost the same as posB
                 var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                 posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                 return [posA, posB, posC]
               })

    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('text')
            .text( function(d) { console.log(d.data.key) ; return d.data.key } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })


}).catch(function(error) {
    console.log(error);
});