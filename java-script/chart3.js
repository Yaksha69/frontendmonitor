const Power = document.getElementById('myChart3');
let myChart3;

function updateChart3(newData) {
    if (Array.isArray(newData)) {
        // Handle initial data
        createChart3(newData[0], newData[1]);
    } else {
        // Handle updates
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
                        text: 'Power (W)' 
                    }
                }
            }
        }
    });
}

// Register this chart with the WebSocket manager
window.chartManager.registerChart('power', updateChart3);

window.addEventListener('resize', () => {
    if (myChart3) {
        myChart3.destroy();
        createChart3(
            myChart3.data.labels,
            myChart3.data.datasets[0].data
        );
    }
});
