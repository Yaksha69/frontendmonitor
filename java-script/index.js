document.addEventListener('DOMContentLoaded', () => {
    const voltageDiv = document.getElementById('voltage');
    const currentDiv = document.getElementById('current');
    const powerDiv = document.getElementById('power');
    const energyDiv = document.getElementById('energy');

    function updateValues(data) {
        voltageDiv.textContent = data.voltage;
        currentDiv.textContent = data.current;
        powerDiv.textContent = data.power;
        energyDiv.textContent = data.energy;
    }

    function setNoData() {
        voltageDiv.textContent = 'No data';
        currentDiv.textContent = 'No data';
        powerDiv.textContent = 'No data';
        energyDiv.textContent = 'No data';
    }

    // Register the live values update function with the WebSocket manager
    window.chartManager.registerLiveValues(updateValues);
    
    // Initialize the WebSocket connection
    window.chartManager.initWebSocket();
});
