window.addEventListener('load', async () => {
    console.log('initializing');
    await loadAllTimeSeries();
    populateStateCounters();
    populateTotal();

    window.mainState = initialState();
});