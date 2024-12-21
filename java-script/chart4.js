const Energy = document.getElementById('myChart4');
let myChart4;

function updateChart4(newData) {
    if (Array.isArray(newData)) {
        // Handle initial data
        createChart4(newData[0], newData[1]);
    } else {
        // Handle updates
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
                        text: 'Energy (Wh)' 
                    }
                }
            }
        }
    });
}

// Register this chart with the WebSocket manager
window.chartManager.registerChart('energy', updateChart4);
