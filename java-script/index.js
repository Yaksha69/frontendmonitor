document.addEventListener('DOMContentLoaded', () => {
    const voltageDiv = document.getElementById('voltage');
    const currentDiv = document.getElementById('current');
    const powerDiv = document.getElementById('power');
    const energyDiv = document.getElementById('energy');

    let ws;

    function initWebSocket() {
        ws = new WebSocket('wss://backvolts.onrender.com');
        
        ws.onopen = () => {
            console.log('WebSocket connected for live values');
        };
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            if (message.type === 'initial') {
                // Update with the most recent value from the initial data
                const lastData = message.data[message.data.length - 1];
                updateValues(lastData);
            } else if (message.type === 'update') {
                // Handle regular updates
                updateValues(message.data);
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error (live values):', error);
        };
        
        ws.onclose = () => {
            console.log('WebSocket disconnected (live values)');
            // Set values to 'No data' when connection is lost
            setNoData();
            // Attempt to reconnect after a delay
            setTimeout(initWebSocket, 3000);
        };
    }

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

    initWebSocket();
});
