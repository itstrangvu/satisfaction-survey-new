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
var dataset;

var xScale, yScale, rScale, xAxis, yAxis;
var formatTime = d3.timeFormat("%d %B");

var channels = ["Google", "Social media", "Blog", "Word of mouth", "Other"]
var myColor = d3.scaleOrdinal().domain(channels).range(d3.schemeSet3);


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
        d.email = d["email"]
        d.source = d["source"]
    });

    dataset = data;

    var startDate = d3.min(data, function(d) { return d.date; });
    console.log(startDate);
    var endDate = d3.max(data, function(d) { return d.date; });

    //Create scale functions
    xScale = d3.scaleTime()
        .domain([
                // d3.timeDay.offset(startDate, -1),  //startDate minus one day, for padding
                new Date(2022, 10, 1), // 01 Nov 2022
                new Date(2023, 5, 31) //  01 Jul 2023
                // d3.timeDay.offset(endDate, 1)	  //endDate plus one day, for padding
            ])
        .range([padding, w - padding]);

    yScale = d3.scaleLinear()
    .domain([
            0,  
            d3.max(data, function(d) { return d.NPS; }),
        ])
    // .range([0,10]);
    // .range([h - padding, padding]);
    .range([h - padding, padding]);

    var rScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 10]);

    //Define X axis
    xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(9)
    .tickFormat(formatTime);

    //Create SVG element
    var svg = d3.select("#dataviz")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

    //Define Y axis
    yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10);

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    

    var simulation = d3.forceSimulation(data)
                    .force('charge', d3.forceManyBody().strength(5))
                    .force('x', d3.forceX().x(function(d) {
                        return xScale(d.date);
                    }))
                    .force('y', d3.forceY().y(function(d) {
                        return -(h/2);
                    }))
                    .force('collision', d3.forceCollide().radius(function(d) {
                        return d.NPS+2;
                    }))
                    .on('tick', ticked);
        
    function ticked() {
        var u = d3.select('svg g')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', function(d) {
                return rScale(d.NPS);
            })
            .style('fill', function(d) {
                return myColor(d.channel);
            })
            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            })
            .attr('opacity', 0.8)
            .style('stroke', 'none')
            .on("mouseover", function(event,d) {
                console.log("Mouse over")
                div.transition()
                  .duration(200)
                  .style("opacity", .8);
                div.html(
                    "Date: " + formatTime(d.date) + 
                    "<br/>" + 
                    "NPS score: " + d.NPS +
                    "<br/>" + 
                    "Email: " + d.email +
                    "<br/>" + 
                    "Channel: " + d.channel +
                    "<br/>" + 
                    "Source: " + d.source
                    )
                    .style("left", (event.pageX + 8) + "px")
                    .style("top", (event.pageY - 8) + "px")
                    this.parentNode.parentNode.appendChild(this.parentNode);      	    
	                this.parentNode.parentNode.parentNode.appendChild(this.parentNode.parentNode);
			        d3.select(this)
                      .style('stroke', 'tomato')
                      .style('stroke-width', 4)
                      .style('opacity', 1)
                    ;
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0)
                    this.parentNode.parentNode.appendChild(this.parentNode);      	    
	                this.parentNode.parentNode.parentNode.appendChild(this.parentNode.parentNode);
			        d3.select(this).style('stroke', 'none');
            })  
            ;
    }

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





