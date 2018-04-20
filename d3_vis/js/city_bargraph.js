$(function() {
    var my_viz_lib = my_viz_lib || {};
    var noSpaces = function(str){
        var result = str.replace(/\s/g,'');
        return result;
    }

    my_viz_lib.lineGraph = function() {
        var highlightcolor = "rgb(19, 193, 182)";
        var svg, pol_city, xAxis, yAxis,
            options_selected_arr;
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 1000 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom;

        var x = d3.scaleBand()
            .range([0, width])
            .padding(.1)
        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxisScale = d3.axisBottom(x)
        var yAxisScale = d3.axisLeft(y)

        function cityListener(){
            var e = document.getElementById("CitySelection");
            if(e.selectedIndex >= 0){
                citySelector = noSpaces(e.options[e.selectedIndex].value);
                updateSelections([citySelector])
            }
        }

        var init = function(init_data){
            document.getElementById("CitySelection")
                .addEventListener("click",cityListener);
            pol_city = init_data;

            svg = d3.select("#city_bargraph").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // x axis
            xAxis = svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")

            yAxis = svg.append("g")
                .attr("class", "y axis")
        }

        var updateSelections = function(input_arr){
            d3.selectAll(".bar").style("fill","#dddddd")
            options_selected_arr = input_arr;
            options_selected_arr.forEach(function(d,i) {
                d3.select("#"+noSpaces(d)).style("fill",highlightcolor);
            })
        }

        var plot = function(){
            x.domain(pol_city.map(function(d) { return d.key; }))
            y.domain([0, d3.max(pol_city, function(d) {
                return d.value; })]);

            // update x axis
            xAxis.call(xAxisScale)
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(-90)")
                .style("text-anchor", "start");

            // y axis
            yAxis.call(yAxisScale)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("AQI");

            // enter function
            svg.selectAll(".bar")
                .data(pol_city)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.key); })
                .attr("id", function(d) { return noSpaces(d.key); })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); });

            // update function
            svg.selectAll(".bar")
                .data(pol_city)
                .attr("x", function(d) { return x(d.key); })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); });

            d3.select("input").on("change", change);

            var sortTimeout = setTimeout(function() {
                d3.select("input").property("checked", true).each(change);
            }, 2000);

            var change = function(){
                clearTimeout(sortTimeout);

                // Copy-on-write since tweens are evaluated after a delay.
                  var x0 = x.domain(pol_city.sort(this.checked
                    ? function(a, b) { return b.value - a.value; }
                    : function(a, b) { return d3.ascending(a.key, b.key); })
                    .map(function(d) { return d.key; }))
                    .copy();

                svg.selectAll(".bar")
                    .sort(function(a, b) { return x0(a.key) - x0(b.key); });

                var transition = svg.transition().duration(750);
                var delay = function(d, i) { return i * 50; };

                transition.selectAll(".bar")
                    .delay(delay)
                    .attr("x", function(d) { return x0(d.key); });

                transition.select(".x.axis")
                    .call(xAxisScale)
                    .selectAll("g")
                    .delay(delay);
            }
        }
        var public = {
            "init": init,
            "updateSelections": updateSelections,
            "plot": plot
            // "assignData": assignData
        };
        return public;
    }


    d3.csv("data/merged_final.csv", function(error, data) {
        if (error) throw error;
        var unique=[]; //mortality subset
        var uniquecombos = [];

        var uni_city=[]; //unique city and date subset
        var uni_date=[];

        data.forEach(function(d,i) {
            // filtering based on location selected
            d.city = d.city;

            // create a subset of mortality based only on unique rows (city & year)
            var combo = d.city + " " +  d.year;

            //mortality data manipulation
            if(uniquecombos.indexOf(combo) === -1){
                uniquecombos.push(combo);

                // sum to get total mortality rate for related diseases
                d.mort= ((+d.CAN)+(+d.CLD)+(+d.HTD)+(+d.STK))
                unique.push(d);
            }
            // create a subset of aqi based only on unique rows (city & date)
            var uni_aqi = d.city + " " +  d.date;
            //mortality data manipulation
            if(uni_date.indexOf(uni_aqi) === -1){
                uni_date.push(uni_aqi);
                // average aqi air pollution calculation
                d.aqi = ((+d.co_aqi_level) + (+d.no2_aqi_level) + (+d.o3_aqi_level) + (+d.so2_aqi_level))/4;
                uni_city.push(d);
            }
        });
        //create subdataset with total mortality rate
        var mort_city= d3.nest()
            .key(function(d) {return d.city;})
            .rollup(function(d) {
                return d3.mean(d, function(g) {return g.mort; });
            }).entries(unique);

        //create subdataset with average aqi
        var pol_city= d3.nest()
            .key(function(d) {return d.city;})
            .rollup(function(d) {
                return d3.mean(d, function(g) {return g.aqi; });
            }).entries(data);

        // plot the city aggregate pollution data
        city_bar_graph =  my_viz_lib.lineGraph();
        city_bar_graph.init(pol_city);
        city_bar_graph.plot();
        city_bar_graph.updateSelections(["Bakersfield"])
    });
})
