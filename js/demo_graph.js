const colorSet = ['blue', 'red', 'darkgreen', 'purple', 'gray'];

function initialState() {
    // highly dependent on layout
    const chartWidth = window.innerWidth - $('.stats-container').outerWidth() - 10;
    const chartHeight = window.innerHeight - $('header').outerHeight() - 16 - 39;
    const options = {
        id: 'chart',
        width: chartWidth,
        height: chartHeight,
        series: [],
        legend: {
            show: false
        }
    };
    return {
        states: [],
        actual: true,
        predicted: true,
        plot: new uPlot(options, [], document.getElementById('chartContainer'))
    };
}

// state example: { states: ['CA', 'FL', 'MA'], actual: true, predicted: false, plot: ? }
function updatePlot(state) {
    const plot = state.plot;
    function lineSeries(postal, labelSuffix, color, dashed) {
        const caseSeries = {
            show: true,
            value: (_, rawValue) => `${rawValue} cases`,
            width: 2
        };
        return {
            ...caseSeries,
            label: `${postal} ${labelSuffix}`,
            stroke: color,
            dash: dashed ? [10, 5] : []
        };
    }

    const xaxis = Array.from(new Set(state.states.map(
        postal => allTimeSeries[postal].times).reduce((a, b) => a.concat(b), []))).sort();
    const data = [xaxis];
    const series = [
        {
            show: true,
            label: 'Date',
            value: (_, rawValue) => new Date(rawValue * 1000).toISOString().slice(0, 10)
        }
    ];
    for (let i = 0; i < state.states.length; i++) {
        const postal = state.states[i];
        if (state.actual) {
            data.push(allTimeSeries[postal].confirmed);
            series.push(lineSeries(postal, 'Actual', colorSet[i], false));
        }
        if (state.predicted) {
            data.push(allTimeSeries[postal].predicted);
            series.push(lineSeries(postal, 'Predicted', colorSet[i], true));
        }
    }

    console.info(data, series);

    plot.batch(() => {
        plot.setData(data);
        // HACK can we replace the series directly?
        while (plot.series.length > 0) plot.delSeries(0);
        for (const serie of series) plot.addSeries(serie);
    });
}


window.onloadOrig = function () {
    // The data stored in the first chart(checkbox)
    var data1 = [{
        type: "line",
        showInLegend: true,
        name: "GroundTruth" ,
        markerType: "square",
        xValueFormatString: "DD MMM, YYYY",
        color: "#F08080",
        dataPoints: dataPoints1
    },
    {
        type: "line",
        showInLegend: true,
        name: "Predicted",
        lineDashType: "dash",
        dataPoints: dataPoints2
    }];

    // The data stored in the second chart(checkbox)
    var data2 = [{
        type: "line",
        showInLegend: true,
        name: "GroundTruth" +  '(' + document.getElementById('searchbox').value + ')',
        markerType: "square",
        xValueFormatString: "DD MMM, YYYY",
        color: "#F08080",
        dataPoints: dataPoints3
    }];

    // The data stored in the third chart(checkbox)
    var data3 = [{
        type: "line",
        showInLegend: true,
        name: "Predicted" + '(' + document.getElementById('searchbox').value + ')',
        lineDashType: "dash",
        dataPoints: dataPoints4
        }]

    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];
    var dataPoints4 = [];

    // First Chart ---- Both
    var chart = new CanvasJS.Chart("chartContainer", {
        height: 380,
        width: 1070,
        animationEnabled: true,
        theme: "light2",
        // title: {
        //     text: "COVID-19 Infection Trend" 
        // },
        axisX: {
            valueFormatString: "MMM, YYYY",
            interval: 1,
            intervalType: "month",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: "Number of Cases",
            // interval: 150,
            includeZero: true,
            crosshair: {
                enabled: true
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries
        },
        data: data1 
    });
    chart.render();
   
    // Second Chart ---- Confirmed Cases
    var chart2 = new CanvasJS.Chart("chartContainer2", {
        height: 380,
        width: 1070,
        animationEnabled: true,
        theme: "light2",
        // title: {
        //     text: "COVID-19 Confirmed Infection Trend"
        // },
        axisX: {
            valueFormatString: "MMM, YYYY",
            interval: 1,
            intervalType: "month",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: "Number of Cases",
            // interval: 150,
            includeZero: true,
            crosshair: {
                enabled: true
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries
        },
        data: data2
    });
    chart2.render();


    // Third Chart ---- Predicted Cases
    var chart3 = new CanvasJS.Chart("chartContainer3", {
        height: 380,
        width: 1070,
        animationEnabled: true,
        theme: "light2",
        // title: {
        //     text: "COVID-19 Predicted Infection Trend"
        // },
        axisX: {
            valueFormatString: "MMM, YYYY",
            interval: 1,
            intervalType: "month",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: "Number of Cases",
            // interval: 150,
            includeZero: true,
            crosshair: {
                enabled: true
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries
        },
        data: data3
    });
    chart3.render();

    //functions
    function toogleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
    var corona_tb = document.getElementById("corona_tb")
    var check_box = corona_tb.getElementsByTagName("INPUT");
    var search_btn = document.querySelector('search_btn');
    var compare_btn = document.querySelector('compare_btn');
    var json_data
    // ./JS files/JSON files/airtable.json
    // ./JS files/JSON files/demo.json
    $.getJSON("./js/JSON files/demo.json", (data) => {
        // c = data.responseJSON;
        json_data = data;
    });

    // display btn
    $(".compare_btn").click(() => {
        let state =
        {
            "Alabama": "AL",
            "Arizona": "AZ",
            "Arkansas": "AR",
            "California": "CA",
            "Colorado": "CO",
            "Connecticut": "CT",
            "Washington": "WA",
            "Alaska": "AK",
            "Delaware": "DE",
            "Florida": "FL",
            "Georgia": "GA",
            "Hawaii": "HI",
            "Idaho": "ID",
            "Illinois": "IL",
            "Indiana": "IN",
            "Iowa": "IA",
            "Kansas": "KS",
            "Kentucky": "KY",
            "Lousiana": "LA",
            "Maine": "ME",
            "Maryland": "MD",
            "Massachusetts": "MA",
            "Michigan": "MI",
            "Minnesota": "MN",
            "Mississippi": "MS",
            "Missouri": "MO",
            "Montana": "MT",
            "Nebraska": "NE",
            "Nevada": "NV",
            "New Hampshire": "NH",
            "New Jersey": "NJ",
            "New Mexico": "NM",
            "New York": "NY",
            "North Carolina": "NC",
            "North Dakota": "ND",
            "Ohio": "OH",
            "Oklahoma": "OK",
            "Oregon": "OR",
            "Pennsylvania": "PA",
            "Rhode Island": "RI",
            "South Carolina	": "SC",
            "South Dakota": "SD",
            "Tennessee": "TN",
            "Texas": "TX",
            "Utah": "UT",
            "Vermont": "VT",
            "Virginia": "VA",
            "West Virginia": "WV",
            "Wisconsin": "WI",
            "Wyoming": "WY"
        }
        data1.splice(2, data1.length);
        data2.splice(1, data2.length);
        data3.splice(1, data3.length);
        // console.log(data1[0]);
        for (let i = 0; i < check_box.length; i++) {
            if (check_box[i].checked) {
                let row = check_box[i].parentNode.parentNode;
                var val= row.cells[2].innerText;
                var new_confirm = {
                    type: "line",
                    showInLegend: true,
                    name: "GroundTruth" +  '(' + val + ')',
                    markerType: "square",
                    xValueFormatString: "DD MMM, YYYY",
                    dataPoints: []
                };
                var new_predict = {
                    type: "line",
                    showInLegend: true,
                    name: "Predicted" + '(' + val + ')',
                    lineDashType: "dash",
                    dataPoints: []
                }
                var arr = [];
                var arr2 = [];
                for (let j = 0; j < json_data[state[val]].length; j++) {
                    // console.log(c[a[val]][j]);
                    arr.push({
                        x: new Date(Date.parse(json_data[state[val]][j].Date)),
                        y: json_data[state[val]][j]["Confirmed Cases"]
                            })
                }
                new_confirm.dataPoints = arr;
                data1.push(new_confirm);
                data2.push(new_confirm);

                for (let j = 0; j < json_data[state[val]].length; j++) {
                    // console.log(c[a[val]][j]);
                    arr2.push({
                        x: new Date(Date.parse(json_data[state[val]][j].Date)),
                        y: json_data[state[val]][j]["Predicted Cases"]
                            })
                }
                new_predict.dataPoints = arr2;
                data1.push(new_predict);
                data3.push(new_predict);
            }
            if (!check_box[i].checked){
                data1.showInLegend = false;
                data1.visible = false;
            }
        }
        chart.render();
        chart2.render();
        chart3.render();
        // data1[0].showInLegend = false;
        // data1[1].showInLegend = false;
        // data1[0].visible = false;
        // data1[1].visible = false;
    });

    // searchbox btn
    $(".search_btn").click(() => {
        // console.log(chart.data[0]);
        let search_val = document.getElementById('searchbox').value;
        console.log(search_val);
        let state =
        {
            "Alabama": "AL",
            "Arizona": "AZ",
            "Arkansas": "AR",
            "California": "CA",
            "Colorado": "CO",
            "Connecticut": "CT",
            "Washington": "WA",
            "Alaska": "AK",
            "Delaware": "DE",
            "Florida": "FL",
            "Georgia": "GA",
            "Hawaii": "HI",
            "Idaho": "ID",
            "Illinois": "IL",
            "Indiana": "IN",
            "Iowa": "IA",
            "Kansas": "KS",
            "Kentucky": "KY",
            "Lousiana": "LA",
            "Maine": "ME",
            "Maryland": "MD",
            "Massachusetts": "MA",
            "Michigan": "MI",
            "Minnesota": "MN",
            "Mississippi": "MS",
            "Missouri": "MO",
            "Montana": "MT",
            "Nebraska": "NE",
            "Nevada": "NV",
            "New Hampshire": "NH",
            "New Jersey": "NJ",
            "New Mexico": "NM",
            "New York": "NY",
            "North Carolina": "NC",
            "North Dakota": "ND",
            "Ohio": "OH",
            "Oklahoma": "OK",
            "Oregon": "OR",
            "Pennsylvania": "PA",
            "Rhode Island": "RI",
            "South Carolina	": "SC",
            "South Dakota": "SD",
            "Tennessee": "TN",
            "Texas": "TX",
            "Utah": "UT",
            "Vermont": "VT",
            "Virginia": "VA",
            "West Virginia": "WV",
            "Wisconsin": "WI",
            "Wyoming": "WY"
        }
        for (let i = 0; i < check_box.length; i++) {
            let row = check_box[i].parentNode.parentNode;
            // console.log(row);
            
        }
        addData(json_data[state[search_val]]);
        // data1[0].showInLegend = true;
        // data1[1].showInLegend = true;
        // data1[0].visible = true;
        // data1[1].visible = true;
    });

    function addData(data){
        // The data of the first chart(both confirmed and predicted)
        chart.options.data[0].dataPoints = [];
        for (let i = 0; i < data.length; i++) {
            dataPoints1.push({
                x: new Date(Date.parse(data[i].Date)),
                y: data[i]["Confirmed Cases"]
            });
            // chart.options.title.text = "COVID-19 Infection Trend" + "(" + document.getElementById('searchbox').value + ")";
            chart.options.data[0].legendText = "GroundTruth" +  '(' + document.getElementById('searchbox').value + ')';
            chart.options.data[0].dataPoints[i-1] = {x: new Date(Date.parse(data[i].Date)), y:data[i]["Confirmed Cases"]};
        }
        chart.render();


        chart.options.data[1].dataPoints = [];
        for (let i = 0; i < data.length; i++) {     
            dataPoints2.push({
                x: new Date(Date.parse(data[i].Date)),
                y: data[i]["Predicted Cases"]
            })
            chart.options.data[1].legendText = "Predicted" +  '(' + document.getElementById('searchbox').value + ')';
            chart.options.data[1].dataPoints[i-1] = {x: new Date(Date.parse(data[i].Date)), y:data[i]["Predicted Cases"]}
        }   ///搜索框里的value引用这个函数，之后改data里面的值
        chart.render();

        // The data of the second chart(confirmed)
        chart2.options.data[0].dataPoints = [];
        for (let i = 0; i < data.length; i++) {
            dataPoints3.push({
                x: new Date(Date.parse(data[i].Date)),
                y: data[i]["Confirmed Cases"]
            }); 
            // chart2.options.title.text = "COVID-19 Confirmed Infection Trend" + "(" + document.getElementById('searchbox').value + ")";
            chart2.options.data[0].legendText = "GroundTruth" +  '(' + document.getElementById('searchbox').value + ')';
            chart2.options.data[0].dataPoints[i-1] = {x: new Date(Date.parse(data[i].Date)), y:data[i]["Confirmed Cases"]};
        }
        chart2.render();

        // The data of the third chart(predicted)
        chart3.options.data[0].dataPoints = [];
        for (let i = 0; i < data.length; i++) {     
            dataPoints2.push({
                x: new Date(Date.parse(data[i].Date)),
                y: data[i]["Predicted Cases"]
            });
            // chart3.options.title.text = "COVID-19 Predicted Infection Trend" + "(" + document.getElementById('searchbox').value + ")";
            chart3.options.data[0].legendText = "Predicted" +  '(' + document.getElementById('searchbox').value + ')';
            chart3.options.data[0].dataPoints[i-1] = {x: new Date(Date.parse(data[i].Date)), y:data[i]["Predicted Cases"]}
        }   ///搜索框里的value引用这个函数，之后改data里面的值
        chart3.render();
    }  

}