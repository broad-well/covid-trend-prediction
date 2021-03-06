// { MA: { times: [...], predicted: [...], confirmed: [...] } }
const allTimeSeries = {};
let nationalTimeSeries = [];

function loadAllTimeSeries() {
    function parseDate(date) {
        const separator = date.indexOf('/') === -1 ? '-' : '/';
        const [year, month, day] = date.split(separator).map(it => parseInt(it));
        return Date.UTC(year, month - 1, day);
    }

    return new Promise((res, _) => {
        console.time('loading')
        Papa.parse('data/predict.csv', {
            download: true,
            header: true,
            step: s => {
                const { Date: dateString, State, Predicted, Confirmed } = s.data;
                const timestamp = parseDate(dateString) / 1000;
                if (State === undefined) return;
                if (!(State in allTimeSeries)) allTimeSeries[State] = {times: [], predicted: [], confirmed: []};
                allTimeSeries[State].times.push(timestamp);
                const confirmed = Math.round(parseFloat(Confirmed));
                const predicted = Math.round(parseFloat(Predicted));

                allTimeSeries[State].confirmed.push(confirmed);
                allTimeSeries[State].predicted.push(predicted === -1 ? confirmed : predicted);
            },
            complete: () => {
                console.timeEnd('loading');
                for (const state in allTimeSeries) {
                    // aggregate(allTimeSeries[state].predicted);
                    // aggregate(allTimeSeries[state].confirmed);
                    if (allTimeSeries[state].times.length > nationalTimeSeries.length) {
                        nationalTimeSeries = [...allTimeSeries[state].times];
                    }
                }
                res();
            }
        });
    });
}

function aggregate(array) {
    for (let i = 1; i < array.length; i++) {
        array[i] += array[i - 1];
    }
    return array;
}