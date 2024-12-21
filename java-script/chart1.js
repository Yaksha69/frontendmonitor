const Voltage = document.getElementById('myChart');
let myChart;

function updateChart(newData) {
    if (Array.isArray(newData)) {
        // Handle initial data
        createChart(newData[0], newData[1]);
    } else {
        // Handle updates
        if (!myChart) {
            createChart([new Date(newData.createdAt).toLocaleTimeString()], [newData.voltage]);
        } else {
            myChart.data.labels.push(new Date(newData.createdAt).toLocaleTimeString());
            myChart.data.datasets[0].data.push(newData.voltage);
            
            if (myChart.data.labels.length > 10) {
                myChart.data.labels.shift();
                myChart.data.datasets[0].data.shift();
            }
            
            myChart.update();
        }
    }
}

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
                        text: 'Voltage (V)' 
                    }
                }
            }
        }
    });
}

// Register this chart with the WebSocket manager
window.chartManager.registerChart('voltage', updateChart);
