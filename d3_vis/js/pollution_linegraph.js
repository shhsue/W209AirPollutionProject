// Attempt at recreating line graphs in d3.
$(function() {

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");
    var uniqueCities = [];

    var my_viz_lib = my_viz_lib || {};
    my_viz_lib.lineGraph = function() {
        // initialize the data set
        var data, svg;
        var citySelector = "San Francisco";
        var pollutants_arr = [1,2,3,4]

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 400,
            height = 190;

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
                line.y(function(d) { return y(d.so2_aqi_level); });
            }
            else if (i === 3) {
                line.y(function(d) { return y(d.no2_aqi_level); });
            }
            else if (i === 4) {
                line.y(function(d) { return y(d.o3_aqi_level); });
            }
            return line;
        }

        function cityListener(){
            var e = document.getElementById("CitySelection");
            if(e.selectedIndex >= 0){
                citySelector = e.options[e.selectedIndex].value;
                plot([1,2,3,4])
            }
        }
        var initialize = function(initialized_data) {
            document.getElementById("CitySelection")
                .addEventListener("click",cityListener);
            data = initialized_data;

            // append the svg obgect to the body of the page
            // appends a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            svg = d3.select(".pollution_line_graph").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class","x-axis")

            // Add the Y Axis
            svg.append("g")
                .attr("class","y-axis")

            // Add the y axis label
            svg.append("text")
                .attr("class","graphlabel")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1.5em")
                .style("text-anchor", "middle")
                .text("Air Quality Index (AQI)");

            // add the title
            svg.append("text")
                .attr("class","graphtitle")
        }
        var updateSelections = function(input_arr){
            pollutants_arr = input_arr;
            plot();
        }

        var plot = function() {

            dataSubset = data.filter(function(d){
                return d.city == citySelector;})

            // Scale the range of the data
            x.domain(d3.extent(dataSubset, function(d) { return d.date; }));
            y.domain([0, d3.max(dataSubset, function(d) {
                return Math.max(d.co_aqi_level, d.no2_aqi_level, d.o3_aqi_level, d.so2_aqi_level);
            })]);
            var getvalue = function(d, index) {
                var result;
                if(index === 1) {
                    result = d.co_aqi_level;
                }
                else if (index === 2) {
                    result = d.so2_aqi_level;
                }
                else if (index === 3) {
                    result = d.no2_aqi_level;
                }
                else if (index === 4) {
                    result = d.o3_aqi_level;
                }
                return result;
            }

            for(index=1; index<5; index++) {
                if(pollutants_arr.indexOf(index) === -1) {
                    // console.log("pollutant " + i + " not passed");
                    // exit function, remove the line
                    svg.selectAll(".line"+index)
                        .remove(); // NOTE: ghetto non-exit removal.
                }
                else {
                    // console.log(pollutants_arr.indexOf(i));
                    // enter function, add the line
                    var line_i = svg.selectAll(".line"+index)
                        .data([data.filter(function(d){
                            return d.city == citySelector;})])
                        .enter()
                        .append("path")
                        .attr("class", "line"+index)
                        .attr("d", valueline(index));
                    //
                    // // enter function, add mouseover effects
                    // var data_pt = svg.selectAll(".points")
                    //     .data(data.filter(function(d){
                    //         return d.city == citySelector;}))
                    //     .enter()
                    //     .append("g")
                    //     .attr("class","points")
                    //     .append("text")
                    //     .datum(function(d) {
                    //         return d;
                    //     })
                    //     .attr("transform", function(d) {
                    //         return "translate(" + x(d.date) + "," + y(getvalue(d,index)) + ")";
                    //     })
                    //     .attr("x", 3)
                    //     .attr("dy", ".35em")
                    //     // .text(function(d) {
                    //     //     return getvalue(d, index);
                    //     // });
                    //
                    // var mouseG = svg.append("g")
                    //     .attr("class", "mouse-over-effects");
                    //
                    // mouseG.append("path") // this is the black vertical line to follow mouse
                    //     .attr("class", "mouse-line")
                    //     .style("stroke", "black")
                    //     .style("stroke-width", "1px")
                    //     .style("opacity", "0");
                    //
                    // var mousePerLine = mouseG.selectAll('.mouse-per-line')
                    //     .data(data)
                    //     .enter()
                    //     .append("g")
                    //     .attr("class", "mouse-per-line");
                    // mousePerLine.append("circle")
                    //     .attr("r", 7)
                    //     .style("stroke", "black")
                    //     .style("fill", "none")
                    //     .style("stroke-width", "1px")
                    //     .style("opacity", "0");
                    //
                    // mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
                    //     .attr('width', width) // can't catch mouse events on a g element
                    //     .attr('height', height)
                    //     .attr('fill', 'none')
                    //     .attr('pointer-events', 'all')
                    //     .on('mouseout', function() { // on mouse out hide line, circles and text
                    //         d3.select(".mouse-line")
                    //             .style("opacity", "0");
                    //         d3.selectAll(".mouse-per-line circle")
                    //             .style("opacity", "0");
                    //         d3.selectAll(".mouse-per-line text")
                    //             .style("opacity", "0");
                    //     })
                    //     .on('mouseover', function() { // on mouse in show line, circles and text
                    //         d3.select(".mouse-line")
                    //             .style("opacity", "1");
                    //         d3.selectAll(".mouse-per-line circle")
                    //             .style("opacity", "1");
                    //         d3.selectAll(".mouse-per-line text")
                    //             .style("opacity", "1");
                    //     })
                    //     .on('mousemove', function() { // mouse moving over canvas
                    //         var mouse = d3.mouse(this);
                    //         d3.select(".mouse-line")
                    //             .attr("d", function() {
                    //                 var d = "M" + mouse[0] + "," + height;
                    //                 d += " " + mouse[0] + "," + 0;
                    //                 return d;
                    //             });
                    //     });

                    // update function, update the line
                    svg.selectAll(".line"+index)
                        .data([data.filter(function(d){
                            // return d.city == "San Francisco";})])
                            return d.city == citySelector;})])
                        .attr("class", "line"+index)
                        .attr("d", valueline(index));
                }
            }

            // update axes and title
            d3.select(".x-axis")
                .call(d3.axisBottom(x));
            d3.select(".y-axis")
                .call(d3.axisLeft(y));
            d3.select(".graphtitle")
                .attr("x", (width / 2))
                .attr("y", 0)
                .attr("text-anchor", "middle")
                .text("Pollution for " + citySelector);
        }
        var public = {
            "init": initialize,
            "updateSelections": updateSelections,
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

            // create a unique list of cities & insert into dropdown
            var select = document.getElementById("CitySelection");
            if(uniqueCities.indexOf(d.city) === -1){
                uniqueCities.push(d.city)
                var city_dropdown_element = document.createElement("option");
                city_dropdown_element.textContent = d.city;
                city_dropdown_element.value = d.city;
                select.appendChild(city_dropdown_element);
            }

            // pollutant data
            d.co_aqi_level = +d.co_aqi_level;
            d.no2_aqi_level = +d.no2_aqi_level;
            d.o3_aqi_level = +d.o3_aqi_level;
            d.so2_aqi_level = +d.so2_aqi_level;
        });

        poll_line_plot =  my_viz_lib.lineGraph();
        poll_line_plot.init(data);
        poll_line_plot.plot();
    });

})
