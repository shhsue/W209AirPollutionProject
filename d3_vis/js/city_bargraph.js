$(function() {
    var my_viz_lib = my_viz_lib || {};

    my_viz_lib.lineGraph = function() {
        var svg, pol_city;
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scaleBand()
            .range([0, width])
            .padding(.1)
        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x)
        var yAxis = d3.axisLeft(y)

        var init = function(init_data){
            pol_city = init_data;

            svg = d3.select("#city_bargraph").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }
        var plot = function(){
            x.domain(pol_city.map(function(d) { return d.key; }))
            y.domain([0, d3.max(pol_city, function(d) {
                return d.value; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(-90)")
                .style("text-anchor", "start");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("AQI");


            svg.selectAll(".bar")
                .data(pol_city)
                .enter().append("rect")
                .attr("class", "bar")
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
                    .call(xAxis)
                    .selectAll("g")
                    .delay(delay);
            }
        }
        var public = {
            "init": init,
            // "updateSelections": updateSelections,
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
        mort_line_plot =  my_viz_lib.lineGraph();
        mort_line_plot.init(pol_city);
        mort_line_plot.plot();
    });
})
