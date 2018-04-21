$(function() {
    var buttonOn = "";
    /* Aqi hover effects -- tooltip visibility */
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

    /* AQI on click call to edit pollutant graph */
    var onAQIClick = function(){
        var aqi = this.id;
        // unclick the button, hide the rangefinder
        console.log(buttonOn, aqi)
        if(buttonOn === aqi){
            buttonOn = "";
            d3.select("#"+aqi).style("background-color","#eeeeee")
            poll_line_plot.rangehighlighter_off();
        }
        // click the button, show the rangefinder
        else {
            buttonOn = aqi;
            d3.select("#"+aqi).style("background-color","#bbbbbb")
            if(aqi === "aqi1"){
                poll_line_plot.rangehighlighter(0,50);
            } else if (aqi === "aqi2") {
                poll_line_plot.rangehighlighter(51,100);
            } else if (aqi === "aqi3") {
                poll_line_plot.rangehighlighter(101,150);
            } else if (aqi === "aqi4") {
                poll_line_plot.rangehighlighter(151,200);
            } else if (aqi === "aqi5") {
                poll_line_plot.rangehighlighter(201,300);
            } else if (aqi === "aqi6") {
                poll_line_plot.rangehighlighter(301,400);
            }
        }
    }

    /* Aqi click effects -- chart shading */
    d3.selectAll(".aqi_button").on("click", onAQIClick)


});
