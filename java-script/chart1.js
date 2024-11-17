const Voltage = document.getElementById('myChart');
let myChart;

// Replace this with your Vercel backend URL
const BACKEND_URL = 'https://backendmonitors-pxak-bndovmdl3-terdys-projects.vercel.app'; // replace with actual backend URL

// Function to fetch data from backend API
async function fetchData() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/data/all`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        const voltageData = data.map(entry => entry.voltage);
        const timeData = data.map(entry => new Date(entry.createdAt).toLocaleTimeString());

        const limitedVoltageData = voltageData.slice(-10);
        const limitedTimeData = timeData.slice(-10);

        createChart(limitedTimeData, limitedVoltageData);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

// Function to create or update the chart
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

        // Fetch latest data to update the chart
        fetchData(); // Re-fetch data to update the chart
    } catch (e) {
        console.error('Error processing SSE message:', e);
    }
};

// Initial fetch to display the chart
fetchData();

// Resize event listener to update chart on window resize
window.addEventListener('resize', () => {
    if (myChart) {
        myChart.destroy(); 
        fetchData(); 
    }
});
