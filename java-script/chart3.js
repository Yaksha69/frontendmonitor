const Power = document.getElementById('myChart3');
let myChart3;
let ws3;

function initWebSocket3() {
    ws3 = new WebSocket('wss://backvolts.onrender.com');
    
    ws3.onopen = () => {
        console.log('WebSocket connected for power data');
    };
    
    ws3.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'initial') {
            const data = message.data;
            const timeData = data.map(d => new Date(d.createdAt).toLocaleTimeString());
            const powerData = data.map(d => d.power);
            createChart3(timeData, powerData);
        } else if (message.type === 'update') {
            updateChart3(message.data);
        }
    };
    
    ws3.onerror = (error) => {
        console.error('WebSocket error (power):', error);
    };
    
    ws3.onclose = () => {
        console.log('WebSocket disconnected (power)');
        setTimeout(initWebSocket3, 3000);
    };
}

function updateChart3(newData) {
    if (!myChart3) {
        createChart3([new Date(newData.createdAt).toLocaleTimeString()], [newData.power]);
    } else {
        myChart3.data.labels.push(new Date(newData.createdAt).toLocaleTimeString());
        myChart3.data.datasets[0].data.push(newData.power);
        
        if (myChart3.data.labels.length > 10) {
            myChart3.data.labels.shift();
            myChart3.data.datasets[0].data.shift();
        }
        
        myChart3.update();
    }
}

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
                        text: 'Power (W)' 
                    }
                }
            }
        }
    });
}

initWebSocket3();

window.addEventListener('resize', () => {
    if (myChart3) {
        myChart3.destroy();
        createChart3(
            myChart3.data.labels,
            myChart3.data.datasets[0].data
        );
    }
});
