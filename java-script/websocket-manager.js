// Create a new file for centralized WebSocket management
let ws;
const charts = new Map();
let liveValuesCallback = null;

function initWebSocket() {
    ws = new WebSocket('wss://backvolts.onrender.com');
    
    ws.onopen = () => {
        console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'initial') {
            const data = message.data;
            updateAllCharts('initial', data);
            // Update live values with most recent data
            if (liveValuesCallback) {
                liveValuesCallback(data[data.length - 1]);
            }
        } else if (message.type === 'update') {
            updateAllCharts('update', message.data);
            // Update live values
            if (liveValuesCallback) {
                liveValuesCallback(message.data);
            }
        }
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
        console.log('WebSocket disconnected');
        setTimeout(initWebSocket, 3000);
    };
}

function updateAllCharts(type, data) {
    if (type === 'initial') {
        const timeData = data.map(d => new Date(d.createdAt).toLocaleTimeString());
        charts.forEach((chart, key) => {
            const chartData = data.map(d => d[key]);
            chart.updateFunction([timeData, chartData]);
        });
    } else {
        charts.forEach((chart, key) => {
            chart.updateFunction(data);
        });
    }
}

// Export these functions
window.chartManager = {
    initWebSocket,
    registerChart: (name, updateFunction) => {
        charts.set(name, { updateFunction });
    },
    registerLiveValues: (callback) => {
        liveValuesCallback = callback;
    }
}; 