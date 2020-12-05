const colorSet = ['blue', 'red', 'darkgreen', 'purple', 'gray'];

function initialState() {
    // highly dependent on layout
    const chartWidth = window.innerWidth - $('.stats-container').outerWidth() - 10;
    const chartHeight = window.innerHeight - $('header').outerHeight() - 16 /*margin*/ - 39 /*tabs*/;
    const options = {
        id: 'chart',
        width: chartWidth,
        height: chartHeight,
        series: [
            {
                show: true,
                label: 'Date',
                value: (_, rawValue) => new Date(rawValue * 1000).toISOString().slice(0, 10)
            }
        ],
        legend: {
            show: true
        }
    };
    return {
        states: [],
        actual: true,
        predicted: true,
        suffixLen: 100,
        plot: new uPlot(options, [], document.getElementById('chartContainer')),
        smooth: 1 / (1 + Math.exp(2 / 3))
    };
}

// state example: { states: ['CA', 'FL', 'MA'], actual: true, predicted: false, suffixLen: 50, smooth: 0.3, plot: ? }
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
    function prepad(array, targetLen) {
        return new Array(targetLen - array.length).fill(0).concat(array);
    }
    function last(array, len) {
        return array.slice(array.length - len, array.length);
    }
    function trailingNegsToNull(array) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i] === -1)
                array[i] = null;
            else
                return array;
        }
        return array;
    }

    const xaxis = last(nationalTimeSeries, state.suffixLen);
    const data = [xaxis];
    const series = [];
    for (let i = 0; i < state.states.length; i++) {
        const postal = state.states[i];
        if (state.actual) {
            data.push(last(smoothedActual(prepad(trailingNegsToNull(allTimeSeries[postal].confirmed), nationalTimeSeries.length), state.smooth), state.suffixLen));
            series.push(lineSeries(postal, 'Actual', colorSet[i], false));
        }
        if (state.predicted) {
            data.push(last(smoothedActual(prepad(allTimeSeries[postal].predicted, nationalTimeSeries.length), state.smooth), state.suffixLen));
            series.push(lineSeries(postal, 'Predicted', colorSet[i], true));
        }
    }

    plot.batch(() => {
        plot.setData(data);
        // HACK can we replace the series directly?
        while (plot.series.length > 1) plot.delSeries(plot.series.length - 1);
        for (const serie of series) plot.addSeries(serie);
    });
}

function smoothedActual(seriesOrig, smoothConstant) {
    const series = [seriesOrig[0]];
    for (let i = 1; i < seriesOrig.length && seriesOrig[i] !== null; i++) {
        series.push(Math.round(smoothConstant * seriesOrig[i - 1] + (1 - smoothConstant) * series[i - 1]));
    }
    while (series.length < seriesOrig.length) {
        series.push(null);
    }
    return series;
}

// called by onchange
function changeSmoothness(value) {
    const coefficient = 1 / (1 + Math.exp(value / 3));
    mainState.smooth = coefficient;
    updatePlot(mainState);
}