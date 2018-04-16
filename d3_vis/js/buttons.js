$(function() {
    /***************************************************************************
    * @description change the background color of self based on selection status
    * @param object $me - the object to be styled
    * @return n/a
    */
    var onPollutantButtonClick = function(me) {
        //TODO: CREATE THE "OFF" STATE FOR BUTTONS
        // indicate which button has been selected
        d3.select(me).style("background-color", "#bbbbbb");

        //TODO: RE-INSTATE HOVER EFFECTS
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
        d3.selectAll(".tooltiptext").style("visibility","hidden");
    }

    /***************************************************************************
    * @description load tooltip txt from json file & assign button functionality including:
            - Selected appearance upon click/unclick
            - Clickable indicator upon hover
            - Details in tooltip upon hover
    * @param    int $pollutant  - Indicate which pollutant to use
                                    (1=CO, 2=S02, 3=N02, 4=O3)
                array $data     - The json data set with the pollutant txt info
    */
    var updatePollutantButtonAndTooltip = function(pollutant, data) {
        // determine what text to set
        title = data.pollutantDetails[pollutant].title
        description = (data.pollutantDetails[pollutant].healthEffects + " " + data.pollutantDetails[pollutant].background)

        // update hover effects
        d3.select("#pollutant"+pollutant)
            // update maps, line graphs, and button appearance on click
            .on("click", function() {
                // TODO: update the maps for the selected pollutant
                // TODO: update the line graphs for the selected pollutant
                // change button color based on click (on/off) status
                onPollutantButtonClick(this);
            })
            // update the hover effects (darken upon hover, lighten @ leave)
            .on("mouseout", function(){ offPollutantButtonHover();})
            .on("mouseover", function() { onPollutantButtonHover(pollutant);})

        // change the tooltip text
        tooltip = d3.select("#tooltip_pollutant_"+pollutant)
        tooltip.html("<strong>" + title + "</strong><br>" + description)
    }

    d3.json("text-content/pollutant-details.json", function(error, data) {
        // assign txt from json data to each tooltip
        updatePollutantButtonAndTooltip(1, data);
        updatePollutantButtonAndTooltip(2, data);
        updatePollutantButtonAndTooltip(3, data);
        updatePollutantButtonAndTooltip(4, data);
    })

})
