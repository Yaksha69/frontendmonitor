const Voltage = document.getElementById('myChart');
let myChart;


async function fetchData() {
    try {
        const response = await fetch('https://backendmonitors-pxak-bndovmdl3-terdys-projects.vercel.app/api/v1/data/all');
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

// Establish WebSocket connection
const socket = new WebSocket('ws://localhost:7000/');

socket.onopen = () => {
    console.log('WebSocket connection established.');
};

socket.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    console.log('Received new data:', newData);

    // Fetch latest data to update the chart
    fetchData(); // Re-fetch data to update the chart
};

socket.onclose = () => {
    console.log('WebSocket connection closed.');
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
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
