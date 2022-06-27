var svg;
var width, height, innerHeight, innerWidth;
var margin = { top: 50, right: 60, bottom: 60, left: 100 };
var dogs, flights;
var flightsToDraw;
var rocket;
var startYear, endYear;

// This will run when the page loads
document.addEventListener('DOMContentLoaded', () => {
    svg = d3.select('#viz');
    toolTip = d3.select("#toolTip")
    width = svg.attr("width");
    height = svg.attr("height");

    //lineWidth = +svg.style('width').replace('px','');
    //lineHeight = +svg.style('height').replace('px','');;
    innerWidth = width - margin.left - margin.right;
    innerHeight = height - margin.top - margin.bottom;

    //Load both files before doing anything else
    Promise.all([d3.csv('../data/Flights-Database.csv', function(d) {
                    var altitude = d["Altitude"];
                    if (isNaN(parseInt(altitude))) {
                        if (altitude === "orbital") {
                            altitude = 500;
                        } else {
                            altitude = 0;
                        }
                    } else {
                        altitude = +altitude;
                    }
                    if (altitude==0) {
                        altitude = 54
                    }
                    return {
                        Date: d["Date"],
                        Dogs: d["Dogs"],
                        Rocket: d["Rocket"],
                        Altitude: altitude,
                        Result: d["Result"],
                        Notes: d["Notes"]
                    };
                })])
                 .then(function(values){
                    dogs = values[0];
                    flights = values[1];

                    flightsToDraw = queryDataset(1960, 1975);
                    drawViz();
                });

});

function drawViz() {
    svg.selectAll("*").remove();
    
    var g = svg.append("g")
                .attr("transform", `translate(${100},${margin.bottom})`);

    var x = d3.scaleBand().range([0, innerWidth]).padding(0.4);
    var y = d3.scaleLinear().range([innerHeight, 0]);

    let yMax = d3.max(flightsToDraw, function(d) {return d["Altitude"]})
    x.domain(flightsToDraw.map(function(d) {return d["Date"];}))
    y.domain([0, yMax]);

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .call(g => g.select(".domain")
            .remove());

    g.append("g")
        .call(d3.axisLeft(y));

    //Axis labels
    g.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 6)
        .style("stroke", "white")
        .text("Launch Date");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x",0 - (height / 2) + 60)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Altitude Reached"); 

    let rockets = flightsToDraw.map(x => x["Rocket"]);
    var colorScale = d3.scaleOrdinal()
                        .domain(rockets)
                        .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"])
   
    const rocketshipPath = "M437.862,500.195l-20.151-120.91c-2.715-16.287-9.386-31.877-19.292-45.084l-80.455-107.273v-101.5   c0-19.903-5.772-61.385-44.428-115.589C269.143,3.678,262.013,0,254.464,0s-14.679,3.678-19.072,9.839   c-38.656,54.204-44.428,95.686-44.428,115.589v101.5L110.51,334.201c-9.906,13.208-16.577,28.798-19.292,45.084l-20.151,120.91   c-0.511,3.065,0.922,6.129,3.603,7.702c1.178,0.691,2.488,1.031,3.794,1.031c1.667,0,3.325-0.555,4.686-1.644l113.854-91.083   l0.668,7.354c0.916,10.077,7.963,18.088,17.292,20.563v25.31c0,4.142,3.358,7.5,7.5,7.5h24.5v24.5c0,4.142,3.358,7.5,7.5,7.5   s7.5-3.358,7.5-7.5v-24.5h24.5c4.142,0,7.5-3.358,7.5-7.5v-25.31c9.329-2.475,16.376-10.486,17.292-20.562l0.669-7.355   l113.854,91.083c1.361,1.089,3.019,1.644,4.686,1.644c1.306,0,2.617-0.34,3.794-1.031   C436.94,506.324,438.373,503.261,437.862,500.195z M247.605,18.548c1.608-2.255,4.108-3.548,6.859-3.548s5.251,1.293,6.859,3.548   c6.292,8.823,14.309,21.098,21.625,35.38h-56.97C233.296,39.646,241.313,27.371,247.605,18.548z M218.95,68.928h71.029   c7.468,17.572,12.986,37.106,12.986,56.5v216.5h-41v-112.5c0-4.142-3.358-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v112.5h-41v-216.5   C205.964,106.034,211.482,86.5,218.95,68.928z M193.779,399.572L89.084,483.327l16.929-101.576   c2.321-13.926,8.025-27.257,16.496-38.55l68.455-91.273v97.5c0,0.227,0.01,0.453,0.031,0.679l0.008,0.087c0,0,0,0.001,0,0.001   l4.399,48.394C194.835,398.844,194.287,399.165,193.779,399.572z M206.677,356.928h40.287v73h-25.889   c-4.425,0-8.064-3.323-8.465-7.73v0L206.677,356.928z M229.964,461.928v-17h17v17H229.964z M261.964,461.928v-17h17v17H261.964z    M287.853,429.928h-25.889v-73h40.287l-5.934,65.27C295.917,426.605,292.278,429.928,287.853,429.928z M315.149,399.572   c-0.508-0.407-1.056-0.727-1.623-0.982l4.399-48.394c0,0,0-0.001,0-0.001l0.008-0.087c0.021-0.226,0.031-0.453,0.031-0.679v-97.5   l68.455,91.273c8.471,11.293,14.175,24.624,16.496,38.55l16.929,101.576L315.149,399.572z"
    g.selectAll("path")
        .data(flightsToDraw)
        .enter()
        .append("path")
        .attr("d", rocketshipPath)
        .attr("transform", (d) => `translate(${x(d["Date"])}, ${y(0)}) scale(0.15)`)
        .attr("fill", (d) => colorScale(d["Rocket"]))
        .attr("class", "rocket")

    g.append("g")
        .selectAll("dot")
        .data(flights)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d["Date"])+40; } )
        .attr("cy", function (d) { return y(d["Altitude"]-20); } )
        .attr("r", 10)
        .style("opacity", "0")
        .on('mouseover', function(d,i) {
            d3.select(this)
                .classed("hover", true)
                .style("stroke-width", 4);
            let record = flights.filter(function(r){
                return (r["Date"] === d["Date"]);
            });

            let popUptext
            try {
                popUptext = `Altitiude: ${d.Altitude} <br>Result: ${d.Result}`;
            } catch (TypeError) {
               
            }
            console.log(d3.event);

            toolTip.html(popUptext)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px")
        

            // toolTip.attr("hidden", false);
            toolTip.transition()
                .duration(50)
                .style("opacity", 1);
        })

        .on('mouseout', function(d,i) {
            d3.select(this).classed("hover", false).style("stroke-width", 1);
            toolTip.attr("hidden", true);
            toolTip.transition()
                .duration(50)
                .style("opacity", 0);
        });;

    g.selectAll(".rocket")
        .transition()
        .duration(800)
        .attr("transform", (d) => `translate(${x(d["Date"])}, ${y(d["Altitude"])}) scale(0.15)`)
        .delay(function(d,i){console.log(i); return(i*100)})

    legend = d3.select("#legendBox")
    // Add one dot in the legend for each name.
    rocketTypes = [...new Set(flights.map(x => x["Rocket"]))];

    legend.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", 130)
        .attr("y", 60)
        .style("fill", "white")
        .text("Rocket Types");

    legend.selectAll("mydots")
        .data(rocketTypes)
        .enter()
        .append("circle")
            .attr("cx", 100)
            .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return colorScale(d)})

    // Add one dot in the legend for each name.
    legend.selectAll("mylabels")
        .data(rocketTypes)
        .enter()
        .append("text")
            .attr("x", 120)
            .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return colorScale(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
}

function queryDataset(startYear, endYear) {
    queried = flights.filter(function(d) {
        let year = +(d["Date"].slice(0,4));
        return year >= startYear && year <= endYear;
    });
    return queried;
}

function updateViz(startYear, endYear) {
    console.log("Updating visualization");
    flightsToDraw = queryDataset(startYear, endYear);
    drawViz();
}
