var channels = {
    // channelCode: [axisGroup, channelName]
    go: [0, "Google"],
    so: [1, "Social media"],
    bl: [2, "Blog"],
    wo: [3, "Word of mouth"], 
    ot: [4, "Other"],
}

// For circles
//Width and height
var w = 1200;
var h = 800;
var padding = 40;

var xScale, yScale, rScale, xAxis, yAxis;
var formatTime = d3.timeFormat("%d %m");

var channels = ["Google", "Social media", "Blog", "Word of mouth", "Other"]
var myColor = d3.scaleOrdinal().domain(channels).range(d3.schemeSet3);

// var rScale = d3.scaleLinear()
//     .range([0, 10]);

//LOAD DATA
d3.csv("source_of_truth.csv").then(function(data){
    data.forEach(function(d){
        d.NPS = parseInt(d["How likely are you to recommend Apify to a friend or a colleague?"])
        if (isNaN(d.NPS))
        {
          d.NPS = 0
        }
        d.date = d3.timeParse("%m/%d/%Y %H:%M:%S")(d["Submitted At"])
        d.channel = d["How did you find Apify? "]
        d.gid = d.channel+d["Token"]
    });

    var startDate = d3.min(data, function(d) { return d.date; });
    var endDate = d3.max(data, function(d) { return d.date; });

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);


    //Create scale functions
    xScale = d3.scaleTime()
        .domain([
                // d3.timeDay.offset(startDate, -1),  //startDate minus one day, for padding
                new Date(2022, 11, 31), // Jul 01 2022
                new Date(2023, 11, 31) // Dec 31 2023
                // d3.timeDay.offset(endDate, 1)	  //endDate plus one day, for padding
            ])
        .range([padding, w - padding]);

    yScale = d3.scaleLinear()
    .domain([
            0,  //Because I want a zero baseline
            d3.max(data, function(d) { return d.NPS; }),
        ])
    // .range([0,10]);
    // .range([h - padding, padding]);
    .range([h - padding, padding]);

    var rScale = d3.scaleSqrt()
    .range([0, 10]);

    
    //Define X axis
    xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(12)
    .tickFormat(formatTime);

    //Create SVG element
    var svg = d3.select("#dataviz")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


    // //Generate guide lines
    // svg.selectAll("line")
    // .data(data)
    // .enter()
    // .append("line")
    // .attr("x1", function(d) {
    //         return xScale(d.date);
    // })
    // .attr("x2", function(d) {
    //         return xScale(d.date);
    // })
    // .attr("y1", h - padding)
    // .attr("y2", function(d) {
    //         return yScale(d.NPS);
    // })
    // .attr("stroke", "#ddd")
    // .attr("stroke-width", 1);

    //Define Y axis
    yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10);


//Generate circles last, so they appear in front
        svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
                return xScale(d.date);
        })
        .attr("fill", function(d) {
                return myColor(d.channel);
        })
        .attr("r", function(d) {
            return rScale(d.NPS)/8 + 4;
        })
        .attr("cy", function(d) {
            return yScale(d.NPS);
        })
        // .attr("cy", h/2)
        .style("stroke", "none")
        .style("opacity", 0.8)
        ;
        
        //Create X axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);
        
        //Create Y axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
});





