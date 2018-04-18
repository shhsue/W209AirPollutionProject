$(function() {
    // Reference link to embed https://stackoverflow.com/questions/37927746/how-to-plot-two-plots-in-the-same-figure-in-plotly-js

    // pull & graph pollution and mortality data charts
    Plotly.d3.csv('data/merged_final.csv',
        function(err, rows){
            function unpack(rows, key) {
                return rows.map(function(row) { return row[key]; });
            }

            // subset of data by graph (MORTALITY, POLLUTION)
            var mort = alasql('SELECT city, year, HTD, CAN, STK, CLD FROM ?', [rows])
            var pol = alasql('SELECT city, date, co_aqi_level, o3_aqi_level, no2_aqi_level, so2_aqi_level FROM ?', [rows])

            // variables from daa extracted
            var allCityNames = unpack(pol, 'city'),
                allDate = unpack(pol, 'date'),
                allCO = unpack(pol, 'co_aqi_level'),
                all03 = unpack(pol, 'o3_aqi_level'),
                allNO2 = unpack(pol, 'no2_aqi_level'),
                allSO2 = unpack(pol, 'so2_aqi_level'),

                allYear = unpack(mort, 'year'),
                allHTD = unpack(mort,'HTD'),
                allCAN = unpack(mort,'CAN'),
                allSTK = unpack(mort, 'STK'),
                allCLD = unpack(mort, 'CLD'),

                listofCity = [],
                currentCity=[],
                currentCO = [],
                currentO3=[],
                currentNO2=[],
                currentSO2=[],
                currentCLD = [],
                currentHTD =[],
                currentSTK=[],
                currentCAN=[],
                currentDate = [],
                currentYear = [];

            // get a unique list of city names
            for (var i = 0; i < allCityNames.length; i++ ){
                if (listofCity.indexOf(allCityNames[i]) === -1 ){
                  listofCity.push(allCityNames[i]);
                }
            }


            function getCityData(chosenCity) {
                currentCity=[];
                currentCO = [];
                currentO3=[];
                currentNO2=[];
                currentSO2=[];
                currentCLD = [];
                currentHTD =[];
                currentSTK=[];
                currentCAN=[];
                currentDate = [];
                currentYear = [];
                for (var i = 0 ; i < allCityNames.length ; i++){
                    if ( allCityNames[i] === chosenCity ) {
                        currentCO.push(allCO[i]);
                        currentO3.push(all03[i]);
                        currentNO2.push(allNO2[i]);
                        currentSO2.push(allSO2[i]);
                        currentDate.push(allDate[i]);
                        currentCLD.push(allCLD[i]);
                        currentHTD.push(allHTD[i]);
                        currentSTK.push(allSTK[i]);
                        currentCAN.push(allCAN[i]);
                        currentYear.push(allYear[i]);
                    }
                }
            };

            // Default City Data
            setBubblePlot('Bakersfield');

            function setBubblePlot(chosenCity) {
                getCityData(chosenCity);

                var co = {
                    x: currentDate,
                    y: currentCO,
                    mode: 'lines+markers',
                    name: 'CO AQI Level',
                    marker: {
                        size: 5,
                        opacity: 0.5
                    }
                };

                var o3 = {
                    x: currentDate,
                    y: currentO3,
                    mode: 'lines+markers',
                    name: 'O3 AQI Level',
                    marker: {
                        size: 5,
                        opacity: 0.5
                    }
                };

                var no2 = {
                    x: currentDate,
                    y: currentNO2,
                    mode: 'lines+markers',
                    name: 'NO2 AQI Level',
                    marker: {
                        size: 5,
                        opacity: 0.5
                    }
                };

                var so2 = {
                    x: currentDate,
                    y: currentSO2,
                    mode: 'lines+markers',
                    name: 'SO2 AQI Level',
                    marker: {
                        size: 5,
                        opacity: 0.5
                    }
                };

                var cld = {
                    x: currentYear,
                    y: currentCLD,
                    xaxis: 'x2',
                    yaxis: 'y2',
                    mode: 'lines+markers',
                    name: 'Respiratory Disease',
                    marker: {
                        size: 5,
                        opacity: 0.5
                    }
                };

                var htd = {
                    x: currentYear,
                    y: currentHTD,
                    xaxis: 'x2',
                    yaxis: 'y2',
                    mode: 'lines+markers',
                    name: 'Heart Disease',
                    marker: {
                        size: 5,
                        opacity: 0.5
                    }
                };

                var stk = {
                    x: currentYear,
                    y: currentSTK,
                    xaxis: 'x2',
                    yaxis: 'y2',
                    mode: 'lines+markers',
                    name: 'Stroke',
                    marker: {
                        size: 5,
                        opacity: 0.5
                    }
                };

                var can = {
                    x: currentYear,
                    y: currentCAN,
                    xaxis: 'x2',
                    yaxis: 'y2',
                    mode: 'lines+markers',
                    name: 'Cancer',
                    marker: {
                        size: 5,
                        opacity: 0.5
                    }
                };

                var data = [co, o3, no2, so2, cld, htd, stk, can];

                var layout = {
                    margin: {
                        l: 20,
                        r: 20,
                        b: 20,
                        t: 20,
                        pad: 5
                    }, 
                //   title: chosenCity,
                  autosize:false,
                  width:500,
                  height: 400,
                //   width: 340,
                  xaxis: {
                    // range: ['2000, 2010'],
                    type: 'date',
                    // domain: [0,1],
                    anchor: 'y1'
                    },
                  yaxis: {
                    title: "Air Quality Index",
                    // range: [0,500],
                      // 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'],
                    type:'linear',
                    domain: [0,0.45]
                    },
                  xaxis2:{
                    // range:[2000,2010],
                    type: 'date',
                    tickformat: '%Y',
                    domain: [0,1],
                    anchor: 'y2'
                    },
                  yaxis2: {
                    title: 'Mortality Rate<br>(per 100,000 People)',
                    anchor: 'x2',
                    // range: [0,600],
                    type: 'linear',
                    domain: [0.55,1],
                  },
                  showlegend: true,
                  legend: {
                    // x: 0,
                    // y: 1,
                    'orientation': "h"},
                  };

                Plotly.newPlot('plotdiv', data, layout);
            };

    var innerContainer = document.querySelector('[data-num="0"'),
        plotEl = innerContainer.querySelector('.plot'),
        CitySelector = document.querySelector('.Citydata');

    function assignOptions(textArray, selector) {
      for (var i = 0; i < textArray.length;  i++) {
          var currentOption = document.createElement('option');
          currentOption.text = textArray[i];
          selector.appendChild(currentOption);
      }
    }

    assignOptions(listofCity, CitySelector);

    function updateCity(){
        setBubblePlot(CitySelector.value);
    }

    CitySelector.addEventListener('change', updateCity, false);
    });
})
