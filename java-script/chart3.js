const Power = document.getElementById('myChart3');
let myChart3;

// Function to fetch data from the API
async function fetchPowerData() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/data/all`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched power data:', data); 

        const powerData = data.map(entry => entry.power); 
        const timeData = data.map(entry => new Date(entry.createdAt).toLocaleTimeString()); 

        // Limit to the last 10 data points
        const limitedPowerData = powerData.slice(-10);
        const limitedTimeData = timeData.slice(-10);

        createChart3(limitedTimeData, limitedPowerData);
    } catch (error) {
        console.error('Error fetching power data:', error);
    }
}

// Function to create or update the chart
function createChart3(timeData, powerData) {
    if (myChart3) {
        myChart3.destroy(); 
    }

    myChart3 = new Chart(Power, {
        type: 'line',
        data: {
            labels: timeData, 
            datasets: [{
                label: 'Power Data', 
                data: powerData, 
                borderWidth: 1,
                borderColor: 'rgb(255,255,0)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // Disable animations
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
                        text: 'Power (W)' // Y-axis label for Power
                    }
                }
            }
        }
    });
}

// Establish WebSocket connection
const socket3 = new WebSocket('ws://localhost:7000/');

socket3.onopen = () => {
    console.log('WebSocket connection established for Chart 3.');
};

socket3.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    console.log('Received new data for Chart 3:', newData);

    // Fetch latest data to update the chart
    fetchPowerData(); // Re-fetch data to update the chart
};

socket3.onclose = () => {
    console.log('WebSocket connection closed for Chart 3.');
};

socket3.onerror = (error) => {
    console.error('WebSocket error for Chart 3:', error);
};

// Initial fetch to display the chart
fetchPowerData();

// Resize event listener to update chart on window resize
window.addEventListener('resize', () => {
    if (myChart3) {
        myChart3.destroy(); 
        fetchPowerData(); 
    }
});
