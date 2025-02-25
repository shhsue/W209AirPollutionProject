$(function() {

    var buttonsSelected = [];
    var mortalitySelected = [];


    /***************************************************************************
    * @description change the background color of self based on selection status
    * @param object $me - the object to be styled
    * @return n/a
    */
    var onGraphingButtonClick = function(me) {
        //TODO: CREATE THE "OFF" STATE FOR BUTTONS
        // indicate which button has been selected
        d3.select(me).style("background-color", "#bbbbbb");

        //TODO: RE-INSTATE HOVER EFFECTS
    }
    var offGraphingButtonClick = function(me) {
        //TODO: CREATE THE "OFF" STATE FOR BUTTONS
        // indicate which button has been selected
        d3.select(me).style("background-color", "#eeeeee");

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

    /***************************************************************************
    * @description hides associated tooltip upon button hover
    * @param n/a
    * @return n/a
    */
    var offPollutantButtonHover = function() {
        d3.selectAll(".poltooltiptext").style("visibility","hidden");
    }
    var offMortalityButtonHover = function() {
        d3.selectAll(".morttooltiptext").style("visibility","hidden");
    }
    /***************************************************************************
    * @description hides associated tooltip upon button hover
    * @param n/a
    * @return n/a
    */
    var onMortalityButtonHover = function(mortality) {
        d3.select("#tooltip_mortality_" + mortality).style("visibility","visible")
        // d3.selectAll(".tooltiptext").style("visibility","visible")
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
                // update the tracking of selected buttons
                if(buttonsSelected.indexOf(pollutant) === -1) {
                    buttonsSelected.push(pollutant);
                    // change status to now indicate button has been clicked
                    onGraphingButtonClick(this);
                } else { // button was previously selected, need to unselect
                    var index = buttonsSelected.indexOf(pollutant);
                    buttonsSelected.splice(index, 1);
                    // change status to now indicate button has been unclicked
                    offGraphingButtonClick(this);
                }

                // update the line graphs for the selected pollutant
                // TODO: update the maps for the selected pollutant
                if(buttonsSelected.length === 0){ // if 0 selected, plot all pollutants
                    poll_line_plot.updateSelections([1,2,3,4]);
                } else { // plot only the selected buttons
                    poll_line_plot.updateSelections(buttonsSelected);
                }


            })
            // update the hover effects (darken upon hover, lighten @ leave)
            .on("mouseout", function(){ offPollutantButtonHover();})
            .on("mouseover", function() { onPollutantButtonHover(pollutant);})

        // change the tooltip text
        tooltip = d3.select("#tooltip_pollutant_"+pollutant)
        tooltip.html("<strong>" + title + "</strong><br>" + description)
    }

    var updateMortalityButtonAndTooltip = function(mortality) {
        // update hover effects
        d3.select("#mortality"+mortality)
            // update maps, line graphs, and button appearance on click
            .on("click", function() {
                // update the tracking of selected buttons
                if(mortalitySelected.indexOf(mortality) === -1) {
                    mortalitySelected.push(mortality);
                    // change status to now indicate button has been clicked
                    onGraphingButtonClick(this);
                } else { // button was previously selected, need to unselect
                    var index = mortalitySelected.indexOf(mortality);
                    mortalitySelected.splice(index, 1);
                    // change status to now indicate button has been unclicked
                    offGraphingButtonClick(this);
                }

                // update the line graphs for the selected mortality
                // TODO: update the maps for the selected pollutant
                if(mortalitySelected.length === 0){ // if 0 selected, plot all pollutants
                    mort_line_plot.updateSelections([1,2,3,4]);
                } else { // plot only the selected buttons
                    mort_line_plot.updateSelections(mortalitySelected);
                }
            })
            // update the hover effects (darken upon hover, lighten @ leave)
            .on("mouseout", function(){ offMortalityButtonHover();})
            .on("mouseover", function() { onMortalityButtonHover(mortality);})
    }

    d3.json("text-content/pollutant-details.json", function(error, data) {
        // assign txt from json data to each tooltip
        updatePollutantButtonAndTooltip(1, data);
        updatePollutantButtonAndTooltip(2, data);
        updatePollutantButtonAndTooltip(3, data);
        updatePollutantButtonAndTooltip(4, data);
    })
    updateMortalityButtonAndTooltip(1);
    updateMortalityButtonAndTooltip(2);
    updateMortalityButtonAndTooltip(3);
    updateMortalityButtonAndTooltip(4);

})
