// Attempt at recreating line graphs in d3.
$(function() {

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    var my_viz_lib = my_viz_lib || {};
    my_viz_lib.lineGraph = function() {
        // initialize the data set
        var data, svg;
        var citySelector = "San Francisco";
        var pollutants_arr = [1,2,3,4]

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 340,
            height = 200;

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
            if(e.selectedIndex > 0){
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
            svg = d3.select(".test_poll").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // add the title
            svg.append("text")
                .attr("class","graphtitle")
        }
        var updatePollutants = function(input_arr){
            pollutants_arr = input_arr;
            plot();
        }

        var plot = function() {

            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) {
                return Math.max(d.co_aqi_level, d.no2_aqi_level, d.o3_aqi_level, d.so2_aqi_level);
            })]);

            for(i=1; i<5; i++) {
                if(pollutants_arr.indexOf(i) === -1) {
                    // console.log("pollutant " + i + " not passed");
                    // exit function, remove the line
                    svg.selectAll(".line"+i)
                        .remove(); // NOTE: ghetto non-exit removal.
                }
                else {
                    // console.log(pollutants_arr.indexOf(i));
                    // enter function, add the line
                    svg.selectAll(".line"+i)
                        .data([data.filter(function(d){
                            // return d.city == "San Francisco";})])
                            return d.city == citySelector;})])
                        .enter()
                        .append("path")
                        .attr("class", "line"+i)
                        .attr("d", valueline(i));

                    // update function, update the line
                    svg.selectAll(".line"+i)
                        .data([data.filter(function(d){
                            // return d.city == "San Francisco";})])
                            return d.city == citySelector;})])
                        .attr("class", "line"+i)
                        .attr("d", valueline(i));
                }
            }

            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

            // update the title
            d3.select(".graphtitle")
                .attr("x", (width / 2))
                .attr("y", 12)
                .attr("text-anchor", "middle")
                .text("Pollution for " + citySelector);
        }
        var public = {
            "init": initialize,
            "updatePollutants": updatePollutants,
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

        poll_line_plot =  my_viz_lib.lineGraph();
        poll_line_plot.init(data);
        poll_line_plot.plot();
    });

})
