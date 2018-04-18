// Attempt at recreating line graphs in d3.
$(function() {
    var my_viz_lib = my_viz_lib || {};

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    my_viz_lib.lineGraph = function() {
        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var valueline = function(i) {
            var line = d3.line()
                .x(function(d) { return x(d.date); })
            if(i === 1) {
                line.y(function(d) { return y(d.co_aqi_level); });

            }
            else if (i === 2) {
                line.y(function(d) { return y(d.no2_aqi_level); });
            }
            else if (i === 3) {
                line.y(function(d) { return y(d.o3_aqi_level); });
            }
            else if (i === 4) {
                line.y(function(d) { return y(d.so2_aqi_level); });
            }
            return line;
        }
        // define the 1st line
        // var valueline = d3.line()
        //     .x(function(d) { return x(d.date); })
        //     .y(function(d) { return y(d.co_aqi_level); });

        // define the 2nd line
        var valueline2 = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.no2_aqi_level); });

        // define the 3rd line
        var valueline3 = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.o3_aqi_level); });

        // define the 4th line
        var valueline4 = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.so2_aqi_level); });

        // var CitySelector = document.querySelector('.Citydata');
        // CitySelector.addEventListener('change', updateCity, false);
        var citySelector = "San Francisco";

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(".test_poll").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var plot = function(data, pollutants_arr) {

            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) {
                return Math.max(d.co_aqi_level, d.no2_aqi_level, d.o3_aqi_level, d.so2_aqi_level); })]);

            for(i=1; i<5; i++) {
                if(pollutants_arr.indexOf(i) === -1) {
                    console.log("pollutant 1 not passed");
                }
                else {
                    console.log(pollutants_arr.indexOf(i));
                    // Add the valueline path.
                    svg.selectAll(".line"+i)
                        .data([data.filter(function(d){
                            return d.city == "San Francisco";})])
                            // return d.city == CitySelector;})])
                        .enter()
                        .append("path")
                        .attr("class", "line"+i)
                        .attr("d", valueline(i));
                }
            }
            // // Add the valueline2 path.
            // svg.selectAll(".line2")
            //     .data([data])
            //     .enter()
            //     .append("path")
            //     .attr("class", "line2")
            //     .style("stroke", "red")
            //     .attr("d", valueline2);
            //
            // // Add the valueline3 path.
            // svg.selectAll(".line3")
            //     .data([data])
            //     .enter()
            //     .append("path")
            //     .attr("class", "line3")
            //     .style("stroke", "green")
            //     .attr("d", valueline3);
            //
            // // Add the valueline3 path.
            // svg.selectAll(".line4")
            //     .data([data])
            //     .enter()
            //     .append("path")
            //     .attr("class", "line4")
            //     .style("stroke", "black")
            //     .attr("d", valueline4);

            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y));
        }
        var public = {
            "plot": plot
            // "assignData": assignData
        };
        return public;

    }
    // Get the data
    d3.csv("data/merged_final.csv", function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            // date data
            d.date = parseTime(d.date);

            // filtering based on location selected
            d.city = d.city;

            // pollutant data
            d.co_aqi_level = +d.co_aqi_level;
            d.no2_aqi_level = +d.no2_aqi_level;
            d.o3_aqi_level = +d.o3_aqi_level;
            d.so2_aqi_level = +d.so2_aqi_level;
        });

        var myPlot =  my_viz_lib.lineGraph();
        myPlot.plot(data, [1,2,3,4]); // plot all 4 pollutants to initialize
    });
})
