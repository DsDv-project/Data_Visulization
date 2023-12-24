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
    updateData();

    const button = d3.select("#button");
    button.on("click", function() {
        countData = countData.slice(0,3);
        updateData();
    });



    
   function updateData(){
    
    d3.select("#graph3").select("svg").remove();

    var width = 1000;
    var height = 600;
    var margin = { top: 100, right: 70, bottom: 50, left: 200 };

    var svg = d3.select("#graph3")
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
        .style("font-size", "20px")
        .attr("fill", "Ivory");
    svg.selectAll("g g.tick line")
        .attr("stroke", "red");
    svg.selectAll("g path.domain")
        .attr("stroke", "green");
    
    svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("fill", "white")  
        .style("font-size", "30px") 
         
        .text("Top Countries with Most Netflix Content");
}}).catch(function(error) {
    console.log(error);
});