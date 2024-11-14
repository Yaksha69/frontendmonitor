const Voltage2 = document.getElementById('myChart2');
let myChart2;
const BACKEND_URL = 'https://backendmonitors-pxak-bndovmdl3-terdys-projects.vercel.app';

// Function to fetch data from the API
async function fetchData2() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/data/all`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        const currentData = data.map(entry => entry.current);
        const timeData = data.map(entry => new Date(entry.createdAt).toLocaleTimeString());

        // Limit to the last 10 data points
        const limitedCurrentData = currentData.slice(-10);
        const limitedTimeData = timeData.slice(-10);

        createChart2(limitedTimeData, limitedCurrentData);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

// Function to create or update the chart
function createChart2(timeData, currentData) {
    if (myChart2) {
        myChart2.destroy(); 
    }

    myChart2 = new Chart(Voltage2, {
        type: 'line',
        data: {
            labels: timeData,
            datasets: [{
                label: 'Current Data',
                data: currentData,
                borderWidth: 1,
                borderColor: 'rgb(255,128,144)',
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
                        text: 'Current (A)' // Change to Current for better clarity
                    }
                }
            }
        }
    });
}

// Establish WebSocket connection
const socket2 = new WebSocket('ws://localhost:7000/');

socket2.onopen = () => {
    console.log('WebSocket connection established for Chart 2.');
};

socket2.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    console.log('Received new data for Chart 2:', newData);

    // Fetch latest data to update the chart
    fetchData2(); // Re-fetch data to update the chart
};

socket2.onclose = () => {
    console.log('WebSocket connection closed for Chart 2.');
};

socket2.onerror = (error) => {
    console.error('WebSocket error for Chart 2:', error);
};

// Initial fetch to display the chart
fetchData2();

// Resize event listener to update chart on window resize
window.addEventListener('resize', () => {
    if (myChart2) {
        myChart2.destroy(); 
        fetchData2(); 
    }
});
