const Energy = document.getElementById('myChart4');
let myChart4;
let ws4;

function initWebSocket4() {
    ws4 = new WebSocket('wss://backvolts.onrender.com');
    
    ws4.onopen = () => {
        console.log('WebSocket connected for energy data');
    };
    
    ws4.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'initial') {
            const data = message.data;
            const timeData = data.map(d => new Date(d.createdAt).toLocaleTimeString());
            const energyData = data.map(d => d.energy);
            createChart4(timeData, energyData);
        } else if (message.type === 'update') {
            updateChart4(message.data);
        }
    };
    
    ws4.onerror = (error) => {
        console.error('WebSocket error (energy):', error);
    };
    
    ws4.onclose = () => {
        console.log('WebSocket disconnected (energy)');
        setTimeout(initWebSocket4, 3000);
    };
}

function updateChart4(newData) {
    if (!myChart4) {
        createChart4([new Date(newData.createdAt).toLocaleTimeString()], [newData.energy]);
    } else {
        myChart4.data.labels.push(new Date(newData.createdAt).toLocaleTimeString());
        myChart4.data.datasets[0].data.push(newData.energy);
        
        if (myChart4.data.labels.length > 10) {
            myChart4.data.labels.shift();
            myChart4.data.datasets[0].data.shift();
        }
        
        myChart4.update();
    }
}

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
                borderColor: 'rgba(54, 162, 235, 1)',
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
                        text: 'Energy (Wh)' 
                    }
                }
            }
        }
    });
}

initWebSocket4();

// Update resize handler
window.addEventListener('resize', () => {
    if (myChart4) {
        myChart4.destroy();
        createChart4(
            myChart4.data.labels,
            myChart4.data.datasets[0].data
        );
    }
});
