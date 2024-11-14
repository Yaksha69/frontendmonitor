const Energy = document.getElementById('myChart4');
let myChart4;

// Function to fetch data from the API
async function fetchEnergyData() {
    try {
        const response = await fetch('https://backendmonitors-pxak-bndovmdl3-terdys-projects.vercel.app/api/v1/data/all');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched energy data:', data); 

        const energyData = data.map(entry => entry.energy); 
        const timeData = data.map(entry => new Date(entry.createdAt).toLocaleTimeString()); 

        // Limit to the last 10 data points
        const limitedEnergyData = energyData.slice(-10);
        const limitedTimeData = timeData.slice(-10);

        createChart4(limitedTimeData, limitedEnergyData);
    } catch (error) {
        console.error('Error fetching energy data:', error);
    }
}

// Function to create or update the chart
function createChart4(timeData, energyData) {
    if (myChart4) {
        myChart4.destroy(); 
    }

    myChart4 = new Chart(Energy, {
        type: 'line',
        data: {
            labels: timeData, 
            datasets: [{
                label: 'Energy Data', 
                data: energyData, 
                borderWidth: 1,
                borderColor: 'rgba(54, 162, 235, 1)', // Updated color if needed
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
                        text: 'Energy (Wh)' // Y-axis label for Energy
                    }
                }
            }
        }
    });
}

// Establish WebSocket connection
const socket4 = new WebSocket('ws://localhost:7000/');

socket4.onopen = () => {
    console.log('WebSocket connection established for Chart 4.');
};

socket4.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    console.log('Received new data for Chart 4:', newData);

    // Fetch latest data to update the chart
    fetchEnergyData(); // Re-fetch data to update the chart
};

socket4.onclose = () => {
    console.log('WebSocket connection closed for Chart 4.');
};

socket4.onerror = (error) => {
    console.error('WebSocket error for Chart 4:', error);
};

// Initial fetch to display the chart
fetchEnergyData();

// Resize event listener to update chart on window resize
window.addEventListener('resize', () => {
    if (myChart4) {
        myChart4.destroy(); 
        fetchEnergyData(); 
    }
});
