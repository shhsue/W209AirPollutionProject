$(function() {
    var onPollButtonClick = function(me) {
        // indicate which buttons haven't been selected
        d3.selectAll(".pollutant_button").style("background-color", "#eeeeee")
        // indicate which button has been selected
        d3.select(me).style("background-color", "#bbbbbb");
    }
    var updatePollutantText = function(pollutant, data) {
        // determine what text to set
        title = data.pollutantDetails[pollutant].title
        description = (data.pollutantDetails[pollutant].healthEffects + " " + data.pollutantDetails[pollutant].background)

        // change the text on the page
        pollutant_descr = d3.select(".pollutant_descr")
        pollutant_descr.select("h2").text(title)
        pollutant_descr.select("p").text(description)
    }
    // when the pollutant filtering buttons are selected, update graphs & icons
    d3.json("text-content/pollutant-details.json", function(error, data) {
        d3.select("#pollutant1")
            .on("click", function() {           // when button #1 is clicked
                                                // update the maps for the selected pollutant
                                                // update the line graphs for the selected pollutant
                onPollButtonClick(this);        // change button colors
                updatePollutantText(1, data);         // informative text for users
            })
        d3.select("#pollutant2")
            .on("click", function() {           // when button #2 is clicked
                                                // update the maps for the selected pollutant
                                                // update the line graphs for the selected pollutant
                onPollButtonClick(this);        // change button colors
                updatePollutantText(2, data);         // informative text for users
            })
        d3.select("#pollutant3")
            .on("click", function() {           // when button #3 is clicked
                                                // update the maps for the selected pollutant
                                                // update the line graphs for the selected pollutant
                onPollButtonClick(this);        // change button colors
                updatePollutantText(3, data);         // informative text for users
            })
        d3.select("#pollutant4")
            .on("click", function() {           // when button #4 is clicked
                                                // update the maps for the selected pollutant
                                                // update the line graphs for the selected pollutant
                onPollButtonClick(this);        // change button colors
                updatePollutantText(4, data);         // informative text for users
            })
    })
})
