const Voltage = document.getElementById('myChart');
let myChart;
let ws;

// Initialize WebSocket connection
function initWebSocket() {
    ws = new WebSocket('wss://backvolts.onrender.com');
    
    ws.onopen = () => {
        console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'initial') {
            // Handle initial data load
            const data = message.data;
            const timeData = data.map(d => new Date(d.createdAt).toLocaleTimeString());
            const voltageData = data.map(d => d.voltage);
            createChart(timeData, voltageData);
        } else if (message.type === 'update') {
            // Handle updates
            updateChart(message.data);
        }
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after a delay
        setTimeout(initWebSocket, 3000);
    };
}

function updateChart(newData) {
    if (!myChart) {
        createChart([new Date(newData.createdAt).toLocaleTimeString()], [newData.voltage]);
    } else {
        myChart.data.labels.push(new Date(newData.createdAt).toLocaleTimeString());
        myChart.data.datasets[0].data.push(newData.voltage);
        
        // Keep only last 10 data points
        if (myChart.data.labels.length > 10) {
            myChart.data.labels.shift();
            myChart.data.datasets[0].data.shift();
        }
        
        myChart.update();
    }
}

function createChart(timeData, voltageData) {
    if (myChart) {
        myChart.destroy(); 
    }

    myChart = new Chart(Voltage, {
        type: 'line',
        data: {
            labels: timeData, 
            datasets: [{
                label: 'Voltage Data', 
                data: voltageData, 
                borderWidth: 1,
                borderColor: 'rgba(75, 192, 192, 1)',
            }]
        },
        options: {
            animation: false,  // Disable all animations
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time' 
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Voltage (V)' 
                    }
                }
            }
        }
    });
}

// Initialize WebSocket connection instead of fetchData()
initWebSocket();

// Update your resize handler
window.addEventListener('resize', () => {
    if (myChart) {
        myChart.destroy();
        // Recreate chart with current data
        createChart(
            myChart.data.labels,
            myChart.data.datasets[0].data
        );
    }
});
