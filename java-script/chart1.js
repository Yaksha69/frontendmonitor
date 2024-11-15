import Ably from 'ably';

const Voltage = document.getElementById('myChart');
let myChart;

// Replace this with your Vercel backend URL
const BACKEND_URL = 'https://backendmonitors-pxak-bndovmdl3-terdys-projects.vercel.app'; // replace with actual backend URL

// Initialize Ably with your API key
const ably = new Ably.Realtime({ key: 'Y3ohHg.BzTY8A:La8DQsFQ2_a1tgM5_TpnGet-1vGO8LAV4QTf2HikVdI' });  // Use your actual Ably API key
const channel = ably.channels.get('voltage-data');  // Ably channel name

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

// Subscribe to the Ably channel for real-time data updates
channel.subscribe('new-data', (message) => {
    console.log('Received new data from Ably:', message.data);

    // Append the new data to the chart dynamically
    // Assuming the message contains voltage data and a timestamp
    const newVoltage = message.data.voltage;
    const newTime = new Date(message.data.createdAt).toLocaleTimeString();

    // Fetch latest data to update the chart
    fetchData(); // Re-fetch data to update the chart
});

// Initial fetch to display the chart
fetchData();

// Resize event listener to update chart on window resize
window.addEventListener('resize', () => {
    if (myChart) {
        myChart.destroy(); 
        fetchData(); 
    }
});
