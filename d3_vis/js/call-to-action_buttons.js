$(function() {
    // smooth scrolling to get to indicated div
    $('a[href*=#]').on('click', function(e) {
        e.preventDefault(); // prevents change of address & new page in history log
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
    });

    d3.select("#explore-los-angeles")
        // update maps, line graphs, bar graphs on click
        .on("click", function() {
            citySelector = "Los Angeles";
            city_bar_graph.updateSelections([citySelector]);
            poll_line_plot.updateCity(citySelector);
            mort_line_plot.updateCity(citySelector);
        })
    d3.select("#explore-san-francisco")
        // update maps, line graphs, bar graphs on click
        .on("click", function() {
            citySelector = "San Francisco";
            city_bar_graph.updateSelections([citySelector]);
            poll_line_plot.updateCity(citySelector);
            mort_line_plot.updateCity(citySelector);
        })
    d3.select("#explore-bakersfield")
        // update maps, line graphs, bar graphs on click
        .on("click", function() {
            citySelector = "Bakersfield";
            city_bar_graph.updateSelections([citySelector]);
            poll_line_plot.updateCity(citySelector);
            mort_line_plot.updateCity(citySelector);
        })
    d3.select("#explore-eureka")
        // update maps, line graphs, bar graphs on click
        .on("click", function() {
            citySelector = "Eureka";
            city_bar_graph.updateSelections([citySelector]);
            poll_line_plot.updateCity(citySelector);
            mort_line_plot.updateCity(citySelector);
        })
})
