$(function() {
    var onPollButtonClick = function(me) {
        // indicate which buttons haven't been selected
        d3.selectAll(".pollutant_button").style("background-color", "#eeeeee")
        // indicate which button has been selected
        d3.select(me).style("background-color", "#dddddd");
    }
    var updatePollutantText = function(pollutant) {
        // TODO: change from series of if statements to dictionary
        // determine what text to set
        if (pollutant == 1) {
            title = "Carbon Monoxide";
            description = "some descr here";
        }
        else if (pollutant == 2) {
            title = "Sulfur Dioxide";
            description = "a";
        }
        else if (pollutant == 3) {
            title = "Nitrogen Dioxide";
            description = "a";
        }
        else if (pollutant == 4) {
            title = "Ozone";
            description = "a";
        }
        else { // return to blank, ready state
            // TODO: should include everything selected in series? multi select? 
            title = "a";
            description = "a";
        }

        // change the text on the page
        pollutant_descr = d3.select(".pollutant_descr")
        pollutant_descr.select("h2").text(title)
        pollutant_descr.select("p").text(description)
    }
    // when the pollutant filtering buttons are selected, update graphs & icons
    d3.select("#pollutant1")
        .on("click", function() {           // when button #1 is clicked
                                            // update the maps for the selected pollutant
                                            // update the line graphs for the selected pollutant
            onPollButtonClick(this);        // change button colors
            updatePollutantText(1);         // informative text for users
        })
    d3.select("#pollutant2")
        .on("click", function() {           // when button #2 is clicked
                                            // update the maps for the selected pollutant
                                            // update the line graphs for the selected pollutant
            onPollButtonClick(this);        // change button colors
            updatePollutantText(2);         // informative text for users
        })
    d3.select("#pollutant3")
        .on("click", function() {           // when button #3 is clicked
                                            // update the maps for the selected pollutant
                                            // update the line graphs for the selected pollutant
            onPollButtonClick(this);        // change button colors
            updatePollutantText(3);         // informative text for users
        })
    d3.select("#pollutant4")
        .on("click", function() {           // when button #4 is clicked
                                            // update the maps for the selected pollutant
                                            // update the line graphs for the selected pollutant
            onPollButtonClick(this);        // change button colors
            updatePollutantText(4);         // informative text for users
        })

})
