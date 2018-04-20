$(function() {
    // smooth scrolling to get to indicated div
    $('a[href*=#]').on('click', function(e) {
        e.preventDefault(); // prevents change of address & new page in history log
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
    });

    d3.select("#explore-los-angeles")
        // update maps, line graphs, bar graphs on click
        .on("click", function() {
            var select = document.getElementById('CitySelection')
            select.value = "Los Angeles"
            city_bar_graph.updateSelections(["Los Angeles"])
            poll_line_plot.updateCity("Los Angeles");
            mort_line_plot.updateCity("Los Angeles");
        })
    d3.select("#explore-san-francisco")
        // update maps, line graphs, bar graphs on click
        .on("click", function() {
            var select = document.getElementById('CitySelection')
            select.value = "San Francisco"
            city_bar_graph.updateSelections(["San Francisco"])
            poll_line_plot.updateCity("San Francisco");
            mort_line_plot.updateCity("San Francisco");
        })
    d3.select("#explore-bakersfield")
        // update maps, line graphs, bar graphs on click
        .on("click", function() {
            var select = document.getElementById('CitySelection')
            select.value = "Bakersfield"
            city_bar_graph.updateSelections(["Bakersfield"])
            poll_line_plot.updateCity("Bakersfield");
            mort_line_plot.updateCity("Bakersfield");
        })
    d3.select("#explore-eureka")
        // update maps, line graphs, bar graphs on click
        .on("click", function() {
            var select = document.getElementById('CitySelection')
            select.value = "Eureka"
            city_bar_graph.updateSelections(["Eureka"])
            poll_line_plot.updateCity("Eureka");
            mort_line_plot.updateCity("Eureka");
        })
})
