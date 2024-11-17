document.addEventListener('DOMContentLoaded', () => {
    const voltageDiv = document.getElementById('voltage');
    const currentDiv = document.getElementById('current');
    const powerDiv = document.getElementById('power');
    const energyDiv = document.getElementById('energy');

    // Create an EventSource to connect to the SSE endpoint
    const eventSource = new EventSource('https://backendmonitors-pxak-qtamft78c-terdys-projects.vercel.app/api/v1/data/events');

    // Listen for messages and update the UI
    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            voltageDiv.textContent = data.voltage;
            currentDiv.textContent = data.current;
            powerDiv.textContent = data.power;
            energyDiv.textContent = data.energy;
        } catch (error) {
            console.error('Error parsing SSE data:', error);
        }
    };

    // Handle errors
    eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSource.close(); // Close the connection if needed
    };
});
