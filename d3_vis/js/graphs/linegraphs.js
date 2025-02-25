// Attempt at recreating line graphs in d3.
$(function() {

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    var my_viz_lib = my_viz_lib || {};
    my_viz_lib.lineGraph = function() {
        // initialize the data set
        var data, svg, rangehighlight;
        var range = {ymin:0, ymax:0};
        var options_selected_arr = [1,2,3,4];
        var graph_type = ""; // Pollution or Mortality

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 400,
            height = 180;

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var valueline = function(i) {
            var line = d3.line()
                .x(function(d) { return x(d.date); })
            if(i === 1) {
                line.y(function(d) { return y(d.var_1); });

            }
            else if (i === 2) {
                line.y(function(d) { return y(d.var_2); });
            }
            else if (i === 3) {
                line.y(function(d) { return y(d.var_3); });
            }
            else if (i === 4) {
                line.y(function(d) { return y(d.var_4); });
            }
            return line;
        }

        var updateCity = function(cities){
            citySelector = cities;
            plot();
        }

        var init = function(initialized_data, graph_type_input) {
            data = initialized_data;
            graph_type = graph_type_input;

            // append the svg obgect to the body of the page
            // appends a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            svg = d3.select("."+graph_type.toLowerCase()+"_line_graph")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // add the range highlighter
            rangehighlight = svg.append("rect")
                .attr("class","rangehighlight")
                .attr("id",graph_type+"_rangehighlight")
                .attr("x", function() { return 0; })
                .attr("width", width)
                .style("fill","#eeeeee")
                .attr("visibility","hidden")

            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class","x-axis")
                .attr("id",graph_type+"_x-axis")

            // Add the Y Axis
            svg.append("g")
                .attr("class","y-axis")
                .attr("id",graph_type+"_y-axis")

            ylab = ""
            if(graph_type=="Pollution"){ ylab = "Air Quality Index (AQI)"; }
            else if (graph_type == "Mortality") {
                ylab = "Mortality, rate of death (per 100,000)"; }

            // Add the y axis label
            svg.append("text")
                .attr("class","graphlabel")
                .attr("id",graph_type+"_graphlabel")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1.5em")
                .style("text-anchor", "middle")
                .text(ylab);

            // add the title
            svg.append("text")
                .attr("class","graphtitle")
                .attr("id",graph_type+"_graphtitle")
        }
        var updateSelections = function(input_arr){
            options_selected_arr = input_arr;
            plot();
        }
        var rangehighlighter = function(min,max){
            // set a new range to ensure the highlighter is displayed within the graph
            range.ymax = max;
            range.ymin = min
            plot();

            rangehighlight.attr("visibility", "visible");
        }
        var rangehighlighter_off = function(){
            // hide the range highlighter
            rangehighlight.attr("visibility", "hidden");

            // replot the data with the new range (only the lines)
            range.ymax = 0;
            range.ymin = 0;
            plot();
        }

        var plot = function() {

            dataSubset = data.filter(function(d){
                return d.city === citySelector;})

            // Scale the range of the data
            x.domain(d3.extent(dataSubset, function(d) { return d.date; }));
            y.domain([0, d3.max(dataSubset, function(d) {
                return Math.max(d.var_1, d.var_3, d.var_4, d.var_2, range.ymax, range.ymin);
            })]);

            // shape & display the range highlighter
            rangehighlight.attr("y", function() { return y(range.ymax); })
                .attr("height", function() { return y(range.ymin); })

            var getvalue = function(d, index) {
                var result;
                if(index === 1) {
                    result = d.var_1;
                }
                else if (index === 2) {
                    result = d.var_2;
                }
                else if (index === 3) {
                    result = d.var_3;
                }
                else if (index === 4) {
                    result = d.var_4;
                }
                return result;
            }

            // plot a line for each of the options selected
            for(index=1; index<5; index++) {
                if(options_selected_arr.indexOf(index) === -1) {
                    // exit function, remove the line
                    svg.selectAll(".line"+index)
                        .remove(); // NOTE: ghetto non-exit removal.
                }
                else {
                    // enter function, add the line
                    var line_i = svg.selectAll(".line"+index)
                        .data([data.filter(function(d){
                            return d.city == citySelector;})])
                        .enter()
                        .append("path")
                        .attr("class", "line"+index)
                        .attr("id",graph_type+"_line"+index)
                        .attr("d", valueline(index));

                    // update function, update the line
                    svg.selectAll(".line"+index)
                        .data([data.filter(function(d){
                            // return d.city == "San Francisco";})])
                            return d.city == citySelector;})])
                        .attr("class", "line"+index)
                        .attr("id",graph_type+"_line"+index)
                        .attr("d", valueline(index));
                }
            }

            // update axes, title, and labels
            d3.select("#"+graph_type+"_x-axis")
                .call(d3.axisBottom(x));
            d3.select("#"+graph_type+"_y-axis")
                .call(d3.axisLeft(y));
            d3.select("#"+graph_type+"_graphtitle")
                .attr("x", (width / 2))
                .attr("y", 0)
                .attr("text-anchor", "middle")
                .text(graph_type+" for " + citySelector);
        }
        var public = {
            "init": init,
            "updateSelections": updateSelections,
            "updateCity": updateCity,
            "rangehighlighter": rangehighlighter,
            "rangehighlighter_off":rangehighlighter_off,
            "plot": plot
            // "assignData": assignData
        };
        return public;

    }
    // Get the data
    d3.csv("data/merged_final.csv", function(error, data) {
        if (error) throw error;

        // format the pollutant data
        data.forEach(function(d,i) {
            // date data
            d.date = parseTime(d.date);

            // filtering based on location selected
            d.city = d.city;

            // create a unique list of cities & save
            if(uniqueCities.indexOf(d.city) === -1){
                uniqueCities.push(d.city)
            }

            // pollutant data
            d.var_1 = +d.co_aqi_level;
            d.var_3 = +d.no2_aqi_level;
            d.var_4 = +d.o3_aqi_level;
            d.var_2 = +d.so2_aqi_level;
        });

        // plot the pollutant data
        poll_line_plot =  my_viz_lib.lineGraph();
        poll_line_plot.init(data, "Pollution");
        poll_line_plot.plot();
    });


    d3.csv("data/merged_final.csv", function(error, data) {
        if (error) throw error;
        var unique=[];
        var uniquecombos = [];

        // format the mortality data
        data.forEach(function(d,i) {
            // date data
            d.date = parseTime(d.date);

            // filtering based on location selected
            d.city = d.city;
            d.year = +d.year;

            // create a subset of mortality based only on unique rows (city & year)
            var combo = d.city + " " +  d.year;
            if(uniquecombos.indexOf(combo) === -1){
                uniquecombos.push(combo);
                unique.push(d);
            }

            // create a unique list of cities & save
            if(uniqueCities.indexOf(d.city) === -1){
                uniqueCities.push(d.city)
            }

            // mortality data
            d.var_1 = +d.HTD;
            d.var_3 = +d.CAN;
            d.var_4 = +d.STK;
            d.var_2 = +d.CLD;
        });

        // plot the mortality data
        mort_line_plot =  my_viz_lib.lineGraph();
        mort_line_plot.init(unique, "Mortality");
        mort_line_plot.plot();
    });
})
