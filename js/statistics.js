function populateStateCounters() {
    function stateCounter(name) {
        const { predicted, confirmed } = allTimeSeries[kAllStates[name]];
        const predict = predicted.reduce((a, b) => a + b, 0);
        const confirm = confirmed.reduce((a, b) => a + b, 0);
        return $(`<tr>
            <td>${confirm}</td>
            <td>${predict}</td>
            <td>${name}</td>
            <td><input type="checkbox" class="check" data-state="${name}" onchange="toggleStateCheckbox('${name}')"></td>
        </tr>`);
    }
    const parent = $("#corona_tb tbody");
    for (const state of Object.keys(kAllStates).sort()) {
        if (kAllStates[state] in allTimeSeries) {
            parent.append(stateCounter(state));
        }
    }
}

function toggleStateCheckbox(name) {
    if ($('input.check').filter(':checked').length >= colorSet.length)
        $('input.check:not(:checked)').attr('disabled', 'true');
    else
        $('input.check').removeAttr('disabled');

    const postal = kAllStates[name];
    const idx = mainState.states.indexOf(postal);
    if (idx === -1) {
        mainState.states.push(postal);
    } else {
        mainState.states.splice(idx, 1);
    }
    updatePlot(mainState);
}

function populateTotal() {
    // Sum all latest # of confirmed cases
    const total = Object.keys(allTimeSeries)
        .map(state => allTimeSeries[state].confirmed.reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
    $('#total-count').text(total);
}
