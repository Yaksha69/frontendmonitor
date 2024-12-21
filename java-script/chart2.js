const Current = document.getElementById('myChart2');
let myChart2;
let ws2;

function initWebSocket2() {
    ws2 = new WebSocket('wss://backvolts.onrender.com');
    
    ws2.onopen = () => {
        console.log('WebSocket connected for current data');
    };
    
    ws2.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'initial') {
            const data = message.data;
            const timeData = data.map(d => new Date(d.createdAt).toLocaleTimeString());
            const currentData = data.map(d => d.current);
            createChart2(timeData, currentData);
        } else if (message.type === 'update') {
            updateChart2(message.data);
        }
    };
    
    ws2.onerror = (error) => {
        console.error('WebSocket error (current):', error);
    };
    
    ws2.onclose = () => {
        console.log('WebSocket disconnected (current)');
        setTimeout(initWebSocket2, 3000);
    };
}

function updateChart2(newData) {
    if (!myChart2) {
        createChart2([new Date(newData.createdAt).toLocaleTimeString()], [newData.current]);
    } else {
        myChart2.data.labels.push(new Date(newData.createdAt).toLocaleTimeString());
        myChart2.data.datasets[0].data.push(newData.current);
        
        if (myChart2.data.labels.length > 10) {
            myChart2.data.labels.shift();
            myChart2.data.datasets[0].data.shift();
        }
        
        myChart2.update();
    }
}

function createChart2(timeData, currentData) {
    if (myChart2) {
        myChart2.destroy(); 
    }

    myChart2 = new Chart(Current, {
        type: 'line',
        data: {
            labels: timeData, 
            datasets: [{
                label: 'Current Data', 
                data: currentData, 
                borderWidth: 1,
                borderColor: 'rgba(153, 102, 255, 1)',
            }]
        },
        options: {
            animation: false,
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
                        text: 'Current (A)' 
                    }
                }
            }
        }
    });
}

initWebSocket2();

window.addEventListener('resize', () => {
    if (myChart2) {
        myChart2.destroy();
        createChart2(
            myChart2.data.labels,
            myChart2.data.datasets[0].data
        );
    }
});
