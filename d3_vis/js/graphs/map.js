// To be filled with content to generate interactive map
$(function() {

    var my_viz_lib = my_viz_lib || {};
    my_viz_lib.map_plot_graph = function() {
        var mydata;

        var init = function(rows){
            mydata=rows
        }

        var updatecities = function(cities){
            citySelector = cities;
            plot();
        }
        var unpack = function(rows, key){
            return rows.map(function(row) { return row[key]; })
        }

        /* Define Plot function*/
        var plot=function() {
            /* Do filtering*/
            var newData = mydata.filter(function(d){
                return d.city == citySelector;
            })

            var greyData = mydata.filter(function(d){
                return d.city != citySelector;
            })

            /* Plot*/
            data=[]
            trace1 = {
                type:'scattermapbox',
                lon: unpack(newData, 'Longitude'),
                lat: unpack(newData, 'Latitude'),
                hoverinfor:  unpack(newData, 'city'),
                text:  unpack(newData, 'city'),
                mode: 'markers',
                marker: {
                    size: unpack(newData, 'agg_allyears'),
                    opacity: 0.5,
                    line: {
                        width: 1,
                        color: 'rgb(102,102,102)'
                    },
                    color: 'rgb(19,193,182)'
                }
            };
            trace2 = {
                type:'scattermapbox',
                lon: unpack(greyData, 'Longitude'),
                lat: unpack(greyData, 'Latitude'),
                hoverinfor:  unpack(greyData, 'city'),
                text:  unpack(greyData, 'city'),
                mode: 'markers',
                marker: {
                    size: unpack(greyData, 'agg_allyears'),
                    opacity: 0.5,
                    line: {
                        width: 1,
                        color: 'rgb(169,169,169)'
                    },
                    color: 'rgb(169,169,169)'
                }
            };

            data=[trace2,trace1]

            layout = {
                title: 'AQI Levels in California',
                showlegend: false,
                autosize: false,
                width: 450,
                height: 450,
                margin: {l: 0,
                    r: 0,
                    b: 10,
                    t: 30,
                    pad: 5
                },
                hovermode:'closest',
                mapbox: {
                    bearing:0,
                    center: {
                        lat:37,
                        lon:-118
                    },
                    pitch:0,
                    zoom:4,
                    style:'light'
                },
              };

            Plotly.setPlotConfig({
              mapboxAccessToken: 'pk.eyJ1IjoiYW5ha2FpMyIsImEiOiJjamZsbm53dTUwanljMndzMnR0ZXZiOWUzIn0.tJZ5UpqBKnHl-TbScs7c5A'
            })
            Plotly.newPlot(pollutant_map, data, layout, {showLink: false});
        } /*End of plot() */


        var public={
            "init":init,
            "updatecities":updatecities,
            "plot":plot
        }
            return public

    } /*End of Class */

    Plotly.d3.csv('data/data_for_js_plot.csv',
        function(err, rows){
            function unpack(rows, key) {
                return rows.map(function(row) { return row[key]; })
            }

            map_plot_graph =  my_viz_lib.map_plot_graph();
            map_plot_graph.init(rows)
            map_plot_graph.plot()
        }
    )
});
