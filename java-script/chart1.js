const Voltage = document.getElementById('myChart');
let myChart;

// Replace this with your Vercel backend URL
const BACKEND_URL = 'https://frontendmonitor.vercel.app/'; // replace with your actual backend URL

// Function to fetch initial data from the backend API
async function fetchData() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/data/all`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched initial data:', data);

        const voltageData = data.map(entry => entry.voltage);
        const timeData = data.map(entry => new Date(entry.createdAt).toLocaleTimeString());

        createChart(timeData, voltageData);
    } catch (error) {
        console.error('Error fetching initial sensor data:', error);
    }
}

// Function to create or update the chart
function createChart(timeData, voltageData) {
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
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
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

// Implement Server-Sent Events (SSE) for real-time updates
const eventSource = new EventSource(`${BACKEND_URL}/api/v1/data/events`);

eventSource.onmessage = (event) => {
    console.log('Received new data from SSE:', event.data);

    try {
        const message = JSON.parse(event.data);

        // Append the new data to the chart dynamically
        const newVoltage = message.voltage;
        const newTime = new Date(message.createdAt).toLocaleTimeString();

        // Update the chart data
        if (myChart) {
            // Add new data points to the chart
            myChart.data.labels.push(newTime);
            myChart.data.datasets[0].data.push(newVoltage);

            // Limit the chart to display only the last 10 data points
            if (myChart.data.labels.length > 10) {
                myChart.data.labels.shift(); // Remove the oldest label
                myChart.data.datasets[0].data.shift(); // Remove the oldest data point
            }

            // Update the chart to reflect the changes
            myChart.update();
        }
    } catch (e) {
        console.error('Error processing SSE message:', e);
    }
};

// Initial fetch to display the chart
fetchData();
