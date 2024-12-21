const Current = document.getElementById('myChart2');
let myChart2;

function updateChart2(newData) {
    if (Array.isArray(newData)) {
        // Handle initial data
        createChart2(newData[0], newData[1]);
    } else {
        // Handle updates
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

// Register this chart with the WebSocket manager
window.chartManager.registerChart('current', updateChart2);

window.addEventListener('resize', () => {
    if (myChart2) {
        myChart2.destroy();
        createChart2(
            myChart2.data.labels,
            myChart2.data.datasets[0].data
        );
    }
});
