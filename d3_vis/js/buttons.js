$(function() {
    /***************************************************************************
    * @description change the background color of self based on selection status
    * @param object $me - the object to be styled
    * @return n/a
    */
    var onPollutantButtonClick = function(me) {
        //TODO: CREATE THE "OFF" STATE FOR BUTTONS
        // indicate which buttons haven't been selected
        d3.selectAll(".pollutant_button").style("background-color", "#eeeeee");
        // indicate which button has been selected
        d3.select(me).style("background-color", "#bbbbbb");
    }

    /***************************************************************************
    * @description hides associated tooltip upon button hover
    * @param n/a
    * @return n/a
    */
    var onPollutantButtonHover = function(pollutant) {
        d3.select("#tooltip_pollutant_" + pollutant).style("visibility","visible")
        // d3.selectAll(".tooltiptext").style("visibility","visible")
    }

    /***************************************************************************
    * @description hides associated tooltip upon button hover
    * @param n/a
    * @return n/a
    */
    var offPollutantButtonHover = function() {
        // d3.selectAll(".tooltiptext").html("");
        d3.selectAll(".tooltiptext").style("visibility","hidden");
    }

    /***************************************************************************
    * @description updates pollutant description text based upon json
    * @param    int $pollutant  - Indicate which pollutant to use
                                    (1=CO, 2=S02, 3=N02, 4=O3)
                array $data     - The json data set with the pollutant txt info
    * @return n/a
    */
    var updatePollutantText = function(pollutant, data) {
        console.log("update fxn called: ")
        // determine what text to set
        title = data.pollutantDetails[pollutant].title
        description = (data.pollutantDetails[pollutant].healthEffects + " " + data.pollutantDetails[pollutant].background)

        // change the text on the page
        pollutant_descr = d3.select(".pollutant_descr")
        pollutant_descr.select("h2").text(title)
        pollutant_descr.select("p").text(description)
    }

    /* load tooltip txt from json file & assign button functionality including:
            - Selected appearance upon click/unclick
            - Clickable indicator upon hover
            - Details in tooltip upon hover
    */
    d3.json("text-content/pollutant-details.json", function(error, data) {
        var i = 0;
        // assign txt from json data to each tooltip
        updatePollutantText(1, data);         // informative text for users

    })

    d3.select("#pollutant1")
        // update maps, line graphs, and button appearance on click
        .on("click", function() {
            // TODO: update the maps for the selected pollutant
            // TODO: update the line graphs for the selected pollutant
            // change button color based on click (on/off) status
            onPollutantButtonClick(this);
        })
        // update the hover effects (darken upon hover, lighten @ leave)
        .on("mouseout", function(){ offPollutantButtonHover();})
        .on("mouseover", function() { onPollutantButtonHover(1);})

    d3.select("#pollutant2")
        // update maps, line graphs, and button appearance on click
        .on("click", function() {
            // TODO: update the maps for the selected pollutant
            // TODO: update the line graphs for the selected pollutant
            // change button color based on click (on/off) status
            onPollutantButtonClick(this);
        })
        // update the hover effects (darken upon hover, lighten @ leave)
        .on("mouseout", function(){ offPollutantButtonHover();})
        .on("mouseover", function() { onPollutantButtonHover(2);})

    d3.select("#pollutant3")
        // update maps, line graphs, and button appearance on click
        .on("click", function() {
            // TODO: update the maps for the selected pollutant
            // TODO: update the line graphs for the selected pollutant
            // change button color based on click (on/off) status
            onPollutantButtonClick(this);
        })
        // update the hover effects (darken upon hover, lighten @ leave)
        .on("mouseout", function(){ offPollutantButtonHover();})
        .on("mouseover", function() { onPollutantButtonHover(3);})

    d3.select("#pollutant4")
        // update maps, line graphs, and button appearance on click
        .on("click", function() {
            // TODO: update the maps for the selected pollutant
            // TODO: update the line graphs for the selected pollutant
            // change button color based on click (on/off) status
            onPollutantButtonClick(this);
        })
        // update the hover effects (darken upon hover, lighten @ leave)
        .on("mouseout", function(){ offPollutantButtonHover();})
        .on("mouseover", function() { onPollutantButtonHover(4);})
})
