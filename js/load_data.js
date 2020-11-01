// { MA: { times: [...], predicted: [...], confirmed: [...] } }
const allTimeSeries = {};
let nationalTimeSeries = [];

function loadAllTimeSeries() {
    return new Promise((res, _) => {
        console.time('loading')
        Papa.parse('data/predict.csv', {
            download: true,
            header: true,
            step: s => {
                const { Date: dateString, State, Predicted, Confirmed } = s.data;
                const timestamp = new Date(dateString).getTime() / 1000;
                if (State === undefined) return;
                if (!(State in allTimeSeries)) allTimeSeries[State] = {times: [], predicted: [], confirmed: []};
                allTimeSeries[State].times.push(timestamp);
                allTimeSeries[State].predicted.push(Math.round(parseFloat(Predicted)));
                allTimeSeries[State].confirmed.push(Math.round(parseFloat(Confirmed)));
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