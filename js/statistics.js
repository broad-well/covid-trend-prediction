function populateStateCounters() {
    function stateCounter(name) {
        const { predicted, confirmed } = allTimeSeries[kAllStates[name]];
        const predict = predicted[predicted.length - 1];
        const confirm = confirmed[confirmed.length - 1];
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
    const postal = kAllStates[name];
    const idx = mainState.states.indexOf(postal);
    if (idx === -1) {
        mainState.states.push(postal);
    } else {
        mainState.states.splice(idx, 1);
    }
    updatePlot(mainState);
}

// Check 3 checkbox and disabled the rest of them
$('.check').change(function(){
    if($('input.check').filter(':checked').length == 3)
        $('input.check:not(:checked)').attr('disabled', 'disabled');
    else
        $('input.check').removeAttr('disabled');
});

function populateTotal() {
    // Sum all latest # of confirmed cases
    const total = Object.keys(allTimeSeries)
        .map(state => allTimeSeries[state].confirmed[allTimeSeries[state].confirmed.length - 1])
        .reduce((a, b) => a + b);
    $('#total-count').text(total);
}