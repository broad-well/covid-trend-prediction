// { MA: { times: [...], predicted: [...], confirmed: [...] } }
const allTimeSeries = {};
const nationalTimeSeries = {}; // TODO

function loadAllTimeSeries() {
    return new Promise((res, _) => {
        console.time('loading')
        Papa.parse('/data/predict.csv', {
            download: true,
            header: true,
            step: s => {
                const { Date: dateString, State, Predicted, Confirmed } = s.data;
                const timestamp = new Date(dateString).getTime() / 1000;
                if (State === undefined) return;
                if (!(State in allTimeSeries)) allTimeSeries[State] = {times: [], predicted: [], confirmed: []};
                allTimeSeries[State].times.push(timestamp);
                allTimeSeries[State].predicted.push(parseInt(Predicted));
                allTimeSeries[State].confirmed.push(parseInt(Confirmed));
            },
            complete: () => {
                console.timeEnd('loading');
                for (const state in allTimeSeries) {
                    aggregate(allTimeSeries[state].predicted);
                    aggregate(allTimeSeries[state].confirmed);
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