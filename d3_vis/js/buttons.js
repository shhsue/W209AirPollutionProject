$(function() {

    var buttonsSelected = []


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
    var offPollutantButtonClick = function(me) {
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
    var offPollutantButtonHover = function() {
        d3.selectAll(".poltooltiptext").style("visibility","hidden");
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
                    onPollutantButtonClick(this);
                } else { // button was previously selected, need to unselect
                    var index = buttonsSelected.indexOf(pollutant);
                    buttonsSelected.splice(index, 1);
                    // change status to now indicate button has been unclicked
                    offPollutantButtonClick(this);
                }

                // update the maps for the selected pollutant
                // TODO: update the line graphs for the selected pollutant
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
    var onAqiButtonHover = function(aqi) {
        d3.select("#tooltip_aqi" + aqi).style("visibility","visible")
    }

    d3.json("text-content/pollutant-details.json", function(error, data) {
        // assign txt from json data to each tooltip
        updatePollutantButtonAndTooltip(1, data);
        updatePollutantButtonAndTooltip(2, data);
        updatePollutantButtonAndTooltip(3, data);
        updatePollutantButtonAndTooltip(4, data);
        d3.select("#aqi1").on("mousover", function(){
            console.log("moused over aqi 1");
            onAqiButtonHover(1);}
        )
    })
    $('#aqi1').mouseenter(function(){
        $('#tooltip_aqi1').css("visibility", "visible"); });
    $('#aqi1').mouseleave(function(){
        $('#tooltip_aqi1').css("visibility", "hidden"); });
    $('#aqi2').mouseenter(function(){
        $('#tooltip_aqi2').css("visibility", "visible"); });
    $('#aqi2').mouseleave(function(){
        $('#tooltip_aqi2').css("visibility", "hidden"); });
    $('#aqi3').mouseenter(function(){
        $('#tooltip_aqi3').css("visibility", "visible"); });
    $('#aqi3').mouseleave(function(){
        $('#tooltip_aqi3').css("visibility", "hidden"); });
    $('#aqi4').mouseenter(function(){
        $('#tooltip_aqi4').css("visibility", "visible"); });
    $('#aqi4').mouseleave(function(){
        $('#tooltip_aqi4').css("visibility", "hidden"); });
    $('#aqi5').mouseenter(function(){
        $('#tooltip_aqi5').css("visibility", "visible"); });
    $('#aqi5').mouseleave(function(){
        $('#tooltip_aqi5').css("visibility", "hidden"); });
    $('#aqi6').mouseenter(function(){
        $('#tooltip_aqi6').css("visibility", "visible"); });
    $('#aqi6').mouseleave(function(){
        $('#tooltip_aqi6').css("visibility", "hidden"); });
})
